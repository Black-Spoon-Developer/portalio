import os
import cv2
import torch
import torchvision.transforms as transforms
from PIL import Image, ImageDraw, ImageFont
from torchvision.models import resnet50
import numpy as np
from collections import deque
import mediapipe as mp
import boto3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import AnalysisResult, Base
from .config import ai_settings

# S3 클라이언트 설정
s3 = boto3.client(
    's3',
    aws_access_key_id=ai_settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=ai_settings.AWS_SECRET_ACCESS_KEY,
    region_name=ai_settings.AWS_REGION
)

# 데이터베이스 설정
DATABASE_URL = f"postgresql://{ai_settings.AI_DATABASE_USER}:{ai_settings.AI_DATABASE_PASSWORD}@{ai_settings.AI_DATABASE_HOST}:{ai_settings.AI_DATABASE_PORT}/{ai_settings.AI_DATABASE_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

# 모델 설정
model = resnet50(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, 7)
model.load_state_dict(torch.load(ai_settings.EMOTION_MODEL_PATH))
model.eval()
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model.to(device)

emotions = ["기쁨", "당황", "분노", "불안", "상처", "슬픔", "중립"]
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
font = ImageFont.truetype(ai_settings.FONT_PATH, 20)

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

def analyze_video(video_file):
    cap = cv2.VideoCapture(video_file)
    

    # 임계값을 위한 큐
    emotion_queue = deque(maxlen=15)
    movement_queue = deque(maxlen=10)
    gaze_movement_queue = deque(maxlen=20)
    
    # 감정 정확도를 올리기 위한 변수들
    emotion_stability_threshold = 0.6
    confidence_threshold = 0.6

    # 움직임과 시선 정확도를 올리기 위한 변수들
    movement_threshold = 0.05  # 더 낮은 값으로 조정
    stability_counter = 0
    max_stability = 50  # 안정성 카운터 증가
    

    # 기본 변수 정보
    current_emotion = "중립"
    movement_focus_score = 100
    gaze_focus_score = 100
    previous_landmarks = None
    prev_left_ratio = None
    prev_right_ratio = None
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # 감정 인식
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
                
                if confidence > confidence_threshold:
                    emotion_queue.append(detected_emotion)
                    current_emotion = smooth_emotions(emotion_queue)
        
        # 포즈 추정
        pose_results = pose.process(rgb_frame)
        if pose_results.pose_landmarks:
            current_landmarks = pose_results.pose_landmarks.landmark
            movement = calculate_movement(current_landmarks, previous_landmarks)
            movement_queue.append(movement)
            avg_movement = sum(movement_queue) / len(movement_queue)
            
            if avg_movement > 0.05:
                movement_focus_score = max(0, movement_focus_score - 0.3)
            else:
                movement_focus_score = min(100, movement_focus_score + 0.2)
            
            previous_landmarks = current_landmarks
        
        # 눈 추적
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
                
                    # 눈 깜빡임 감지
                if avg_ear < 0.2:  # 눈 깜빡임 임계값을 낮춤
                    # 눈 깜빡임 동안은 움직임 계산에서 제외
                    pass
                elif moving_avg > movement_threshold:
                    gaze_focus_score = max(0, gaze_focus_score - 0.1)  # 감소 속도 줄임
                    stability_counter = 0
                else:
                    stability_counter += 1
                    if stability_counter > max_stability:
                        gaze_focus_score = min(100, gaze_focus_score + 0.05)  # 증가 속도 조절
                        stability_counter = max_stability
            
            prev_left_ratio = left_ratio
            prev_right_ratio = right_ratio
    
    cap.release()
    
    return {
        "현재 감정": current_emotion,
        "움직임 집중도": movement_focus_score,
        "시선 집중도": gaze_focus_score
    }


async def upload_and_analyze_video(interview_id: int, question_id: int, file: UploadFile):
    temp_file = f"temp_{interview_id}_{question_id}.mp4"
    with open(temp_file, "wb") as buffer:
        buffer.write(await file.read())

    analysis_result = analyze_video(temp_file)

    s3_key = f'{interview_id}/{question_id}.mp4'
    s3.upload_file(temp_file, ai_settings.S3_BUCKET_NAME, s3_key)

    save_analysis_result(interview_id, question_id, analysis_result, s3_key)

    os.remove(temp_file)

    return {"message": "Video uploaded and analyzed successfully", "s3_key": s3_key}

def save_analysis_result(interview_id, question_id, result, s3_key):
    db = SessionLocal()
    db_result = AnalysisResult(
        interview_id=interview_id,
        question_id=question_id,
        emotion=result["현재 감정"],
        movement_focus_score=result["움직임 집중도"],
        gaze_focus_score=result["시선 집중도"],
        s3_key=s3_key
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    db.close()

async def get_analysis(interview_id: int):
    db = SessionLocal()
    results = db.query(AnalysisResult).filter(AnalysisResult.interview_id == interview_id).all()
    db.close()

    if not results:
        return {"error": "Interview not found"}

    overall_emotion = max(set([r.emotion for r in results]), key=[r.emotion for r in results].count)
    avg_movement_focus = sum([r.movement_focus_score for r in results]) / len(results)
    avg_gaze_focus = sum([r.gaze_focus_score for r in results]) / len(results)

    return {
        "overall_emotion": overall_emotion,
        "avg_movement_focus_score": avg_movement_focus,
        "avg_gaze_focus_score": avg_gaze_focus
    }

async def get_question_analysis(interview_id: int, question_id: int):
    db = SessionLocal()
    result = db.query(AnalysisResult).filter(
        AnalysisResult.interview_id == interview_id,
        AnalysisResult.question_id == question_id
    ).first()
    db.close()

    if result:
        return {
            "emotion": result.emotion,
            "movement_focus_score": result.movement_focus_score,
            "gaze_focus_score": result.gaze_focus_score,
            "s3_key": result.s3_key
        }
    else:
        return {"error": "Analysis not found"}