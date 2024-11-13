import os
from dotenv import load_dotenv
import boto3
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import torch
import torchvision.transforms as transforms
from PIL import Image, ImageDraw, ImageFont
from torchvision.models import resnet50
import numpy as np
from collections import deque
import mediapipe as mp
import time
import librosa
from pydantic import BaseModel
import asyncio
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React 개발 서버의 도메인을 명시적으로 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용 (GET, POST, DELETE 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

# S3 클라이언트 설정
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

# 모델 설정 (DB 없이 테스트 가능)
model = resnet50(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, 7)
model.load_state_dict(torch.load(os.getenv('EMOTION_MODEL_PATH')))
model.eval()
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model.to(device)

emotions = ["기쁨", "당황", "분노", "불안", "상처", "슬픔", "중립"]
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
font = ImageFont.truetype(os.getenv('FONT_PATH'), 20)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# MediaPipe 설정
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# 기타 설정
LEFT_IRIS = [474, 475, 476, 477]
RIGHT_IRIS = [469, 470, 471, 472]
LEFT_EYE = [362, 263, 386]
RIGHT_EYE = [33, 133, 159]

# 분석 결과 데이터 저장용
analysis_results = {}

def put_korean_text(image, text, position, font, color=(0,255,0)):
    img_pil = Image.fromarray(image)
    draw = ImageDraw.Draw(img_pil)
    draw.text(position, text, font=font, fill=color)
    return np.array(img_pil)

def smooth_emotions(emotion_queue):
    if not emotion_queue:
        return "중립"
    emotion_counts = {}
    for emotion in emotion_queue:
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
    most_common = max(emotion_counts, key=emotion_counts.get)
    stability = emotion_counts[most_common] / len(emotion_queue)
    return most_common if stability >= 0.6 else "중립"

def apply_face_enhancement(face_roi):
    face_roi = cv2.cvtColor(np.array(face_roi), cv2.COLOR_RGB2BGR)
    face_roi = cv2.detailEnhance(face_roi, sigma_s=10, sigma_r=0.15)
    face_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB)
    return Image.fromarray(face_roi)

def calculate_movement(current_landmarks, previous_landmarks):
    if previous_landmarks is None:
        return 0
    movement = 0
    for i in range(11, 23):
        current_point = np.array([current_landmarks[i].x, current_landmarks[i].y])
        previous_point = np.array([previous_landmarks[i].x, previous_landmarks[i].y])
        movement += np.linalg.norm(current_point - previous_point)
    return movement

def get_iris_ratio(iris_landmarks, eye_landmarks):
    eye_width = np.linalg.norm(eye_landmarks[1] - eye_landmarks[0])
    iris_center = np.mean(iris_landmarks, axis=0)
    left_edge_dist = np.linalg.norm(iris_center - eye_landmarks[0])
    right_edge_dist = np.linalg.norm(iris_center - eye_landmarks[1])
    iris_width = right_edge_dist - left_edge_dist
    return iris_width / eye_width

def get_eye_aspect_ratio(eye_landmarks):
    vertical_dist = np.linalg.norm(eye_landmarks[1] - eye_landmarks[2])
    horizontal_dist = np.linalg.norm(eye_landmarks[0] - eye_landmarks[1])
    return vertical_dist / horizontal_dist



async def analyze_video(video_file):
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        result = await loop.run_in_executor(pool, sync_analyze_video, video_file)
    return result


class TimeSeriesData(BaseModel):
    time: int
    emotion: str
    movement_focus: float
    gaze_focus: float

class AnalysisResult(BaseModel):
    현재_감정: str
    움직임_집중도: float
    시선_집중도: float
    time_series_data: list[TimeSeriesData]


def analysis_audio(temp_file):

    # 오디오 파일 로드
    y, sr = librosa.load(temp_file)

    # 1. 속도 분석 (말하는 속도)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

    # 2. RMS 에너지 분석 (음성 떨림)
    rms = librosa.feature.rms(y=y)[0]
    rms_std = np.std(rms)

    # 3. 무음 구간 분석
    intervals = librosa.effects.split(y, top_db=20)
    total_speech = sum(interval[1] - interval[0] for interval in intervals)
    silence_duration = len(y) - total_speech
    silence_ratio = silence_duration / len(y)

    # 4. 유창성 (Fluency) - 간단한 근사치
    fluency_score = 1 - silence_ratio

    # 결과 출력
    print(f"음성 속도평균(BPM): {tempo}")
    print(f"볼륨 크기(RMS 표준편차): {rms_std:.2f}")
    print(f"무음 구간 비율: {silence_ratio:.2f}")
    print(f"유창성 점수: {fluency_score:.2f}")


    return{
        "음성 속도평균(BPM)" : tempo,
        "볼륨 크기(RMS 표준편차)" : round(rms_std,2),
        "무음 구간 비율": round(silence_ratio,2),
        "유창성 점수" : round(fluency_score,2)
    }


def sync_analyze_video(video_file):
    cap = cv2.VideoCapture(video_file)
    if not cap.isOpened():
        return {"error": "Video file could not be opened."}

    # 임계값을 위한 큐
    emotion_queue = deque(maxlen=15)
    movement_queue = deque(maxlen=10)
    gaze_movement_queue = deque(maxlen=20)

    # 기본 변수 정보 초기화
    current_emotion = "중립"
    movement_focus_score = 100
    gaze_focus_score = 100
    previous_landmarks = None
    prev_left_ratio = None
    prev_right_ratio = None

    # 시간 관련 변수
    last_recorded_second = -1
    time_series_data = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        current_second = int(cap.get(cv2.CAP_PROP_POS_MSEC) / 1000)
        if current_second != last_recorded_second:
            time_series_data.append({
                "time": current_second,
                "emotion": current_emotion,
                "movement_focus": round(movement_focus_score, 2),
                "gaze_focus": round(gaze_focus_score, 2)
            })
            last_recorded_second = current_second

        # 감정 인식, 포즈 추정, 시선 추적 등의 기존 코드
        # 감정 인식 (Emotion Detection)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        if len(faces) > 0:
            (x, y, w, h) = max(faces, key=lambda f: f[2] * f[3])
            face_roi = frame[y:y+h, x:x+w]
            face_roi = Image.fromarray(cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB))
            face_roi = apply_face_enhancement(face_roi)
            face_roi = transform(face_roi).unsqueeze(0).to(device)
            
            with torch.no_grad():
                prediction = model(face_roi)
                probabilities = torch.nn.functional.softmax(prediction, dim=1)
                max_prob, emotion_idx = torch.max(probabilities, dim=1)
                detected_emotion = emotions[emotion_idx.item()]
                confidence = max_prob.item()
                
                if confidence > 0.6:
                    emotion_queue.append(detected_emotion)
                    current_emotion = smooth_emotions(emotion_queue)
        
        # 포즈 추정 (Pose Estimation)
        pose_results = pose.process(rgb_frame)
        if pose_results.pose_landmarks:
            current_landmarks = pose_results.pose_landmarks.landmark
            movement = calculate_movement(current_landmarks, previous_landmarks)
            movement_queue.append(movement)
            avg_movement = sum(movement_queue) / len(movement_queue)
            
            if avg_movement > 0.05:
                movement_focus_score = max(0, movement_focus_score - 0.1)
            else:
                movement_focus_score = min(100, movement_focus_score + 0.1)
            
            previous_landmarks = current_landmarks
        
        # 시선 추적 (Gaze Tracking)
        face_mesh_results = face_mesh.process(rgb_frame)
        if face_mesh_results.multi_face_landmarks:
            mesh_points = np.array([np.multiply([p.x, p.y], [frame.shape[1], frame.shape[0]]).astype(int) 
                                    for p in face_mesh_results.multi_face_landmarks[0].landmark])
            
            left_iris = mesh_points[LEFT_IRIS]
            right_iris = mesh_points[RIGHT_IRIS]
            left_eye = mesh_points[LEFT_EYE]
            right_eye = mesh_points[RIGHT_EYE]
            
            left_ratio = get_iris_ratio(left_iris, left_eye[:2])
            right_ratio = get_iris_ratio(right_iris, right_eye[:2])
            
            left_ear = get_eye_aspect_ratio(left_eye)
            right_ear = get_eye_aspect_ratio(right_eye)
            avg_ear = (left_ear + right_ear) / 2
            
            if prev_left_ratio is not None and prev_right_ratio is not None:
                left_movement = abs(left_ratio - prev_left_ratio)
                right_movement = abs(right_ratio - prev_right_ratio)
                avg_movement = (left_movement + right_movement) / 2
                gaze_movement_queue.append(avg_movement)
                moving_avg = sum(gaze_movement_queue) / len(gaze_movement_queue)
                
                if avg_ear < 0.2:
                    pass
                elif moving_avg > 0.05:
                    gaze_focus_score = max(0, gaze_focus_score - 0.1)
                else:
                    gaze_focus_score = min(100, gaze_focus_score + 0.05)
            
            prev_left_ratio = left_ratio
            prev_right_ratio = right_ratio

    cap.release()
    
    # 최종 결과 반환
    return {
        "현재 감정": current_emotion,
        "움직임 집중도": round(movement_focus_score, 2),
        "시선 집중도": round(gaze_focus_score, 2),
        "time_series_data": time_series_data
    }

@app.post("/api/v1/ai/interview/questions")
async def start_interview():
    return {"interview_id": 1, "questions": [
        "자기소개를 해주세요.",
        "지원 동기는 무엇인가요?",
        "본인의 장점과 단점은 무엇인가요?",
        "5년 후 자신의 모습을 어떻게 그리고 있나요?",
        "마지막으로 하고 싶은 말씀이 있다면?"
    ]}

@app.post("/api/v1/ai/interview/{interview_id}/questions/{question_id}/upload-audio")
async def upload_audio(interview_id: int, question_id:int, file: UploadFile = File(...)):
    temp_file = f"temp_{interview_id}_{question_id}.wav"

    with open(temp_file,"wb") as buffer:
        buffer.write(await file.read())

    analysis_voice_results = await analysis_audio(temp_file)
    print(analysis_voice_results)



@app.post("/api/v1/ai/interview/{interview_id}/questions/{question_id}/upload-video")
async def upload_video(interview_id: int, question_id: int, file: UploadFile = File(...)):
    temp_file = f"temp_{interview_id}_{question_id}.mp4"

    # 파일을 완전히 저장
    with open(temp_file, "wb") as buffer:
        buffer.write(await file.read())

    # 비디오 분석 후 S3 업로드
    analysis_result = await analyze_video(temp_file)
    print(analysis_result)
    s3_key = f'{interview_id}/{question_id}.mp4'
    s3.upload_file(temp_file, os.getenv('S3_BUCKET_NAME'), s3_key)
    os.remove(temp_file)

    # 인터뷰 ID에 결과 저장 후 전달
    if interview_id not in analysis_results:
        analysis_results[interview_id] = {}
    analysis_results[interview_id][question_id] = analysis_result

    return {"message": "Video uploaded and analyzed successfully", "s3_key": s3_key, "analysis_result": analysis_result}

@app.get("/api/v1/ai/analysis/{interview_id}", response_model=AnalysisResult)
async def get_analysis(interview_id: int):
    if interview_id not in analysis_results:
        raise HTTPException(status_code=404, detail="Analysis not found for this interview")
    return analysis_results[interview_id]
