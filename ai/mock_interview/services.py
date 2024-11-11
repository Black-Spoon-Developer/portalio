from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import Member, Portfolio, Repository, MemberJob, JobSubCategory
from schemas import MemberInfoDTO

# S3업로드 
import boto3
import os

# 오디오 및 비디오 분석 처리
import cv2
import torch
from collections import deque
import mediapipe as mp
import librosa
import numpy as np
from concurrent.futures import ThreadPoolExecutor
import asyncio
from torchvision.models import resnet50
import torchvision.transforms as transforms
from PIL import Image, ImageDraw, ImageFont



async def get_member_records(db: AsyncSession, member_id: int) -> MemberInfoDTO:
    # 사용자 정보 조회
    result = await db.execute(select(Member).filter(Member.member_id == member_id))
    member = result.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="유저 정보 없음")
    
    # 포트폴리오와 요약 정보 매핑
    portfolios = [
        {
            "portfolio_id": portfolio.portfolio_id,
            "portfolio_title": portfolio.portfolio_title,
            "portfolio_content": portfolio.portfolio_content,
            "portfolio_summary": portfolio.summary.summary_text if portfolio.summary else None
        }
        for portfolio in member.portfolios
    ]

    # 리포지토리와 요약 정보 매핑
    repositories = [
        {
            "repository_id": repo.repository_id,
            "repository_title": repo.repository_title,
            "repository_content": repo.repository_content,
            "repository_summary": repo.summary.summary_text if repo.summary else None
        }
        for repo in member.repositories
    ]

    # 희망 직무 정보 조회 및 매핑
    hope_jobs = [
        {
            "job_id": job.job_id,
            "job_name": job.job.job_name
        }
        for job in member.member_jobs
    ]

    return MemberInfoDTO(
        member_id=member.member_id,
        portfolios=portfolios,
        repositories=repositories,
        hope_jobs=hope_jobs
    )

# S3 업로드 처리

s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

def upload_file_to_s3(file_path: str, s3_key: str):
    bucket_name = os.getenv('S3_BUCKET_NAME')
    s3.upload_file(file_path, bucket_name, s3_key)



# 분석에 필요한 모델, 객체 초기화

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



## service

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



# 비디오 및 오디오 분석 처리

async def analyze_audio(audio_file_path):
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

    return {
        "음성 속도(BPM)": tempo,
        "볼륨 떨림 정도(RMS 표준편차)": round(rms_std, 2),
        "무음 비율": round(silence_ratio, 2),
        "유창성 점수": round(fluency_score, 2)
    }

async def analyze_video(video_file):
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        result = await loop.run_in_executor(pool, sync_analyze_video, video_file)
    return result

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