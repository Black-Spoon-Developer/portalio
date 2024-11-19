# video_analyze.py
import tempfile
from io import BytesIO
import asyncio
import json
import os
import uuid
import cv2
import torch
import torchvision.transforms as transforms
from PIL import Image
from torchvision.models import resnet50
import numpy as np
from collections import deque
import mediapipe as mp
import logging
from fastapi import FastAPI, UploadFile, HTTPException
from tempfile import NamedTemporaryFile
from typing import Dict, Union

logger = logging.getLogger(__name__)
app = FastAPI()

class VideoAnalyzer:
    def __init__(self):
        try:
            # 모델 설정
            self.model = resnet50(weights=None)
            self.model.fc = torch.nn.Linear(self.model.fc.in_features, 7)
            model_path = os.getenv('EMOTION_MODEL_PATH', './final_model.pth')
            if not os.path.exists(model_path):
                raise ValueError(f"Model file not found at {model_path}")
            self.model.load_state_dict(
                torch.load(
                    model_path,
                    map_location=torch.device('cpu')
                )
            )
            self.model.eval()
            self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
            self.model.to(self.device)

            # 감정 분석 설정
            self.emotions = ["기쁨", "당황", "분노", "불안", "상처", "슬픔", "중립"]
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            self.transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
            ])

            # MediaPipe 설정
            self.mp_pose = mp.solutions.pose
            self.pose = self.mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
            self.mp_face_mesh = mp.solutions.face_mesh
            self.face_mesh = self.mp_face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.5, min_tracking_confidence=0.5)
            self.LEFT_IRIS = [474, 475, 476, 477]
            self.RIGHT_IRIS = [469, 470, 471, 472]
            self.LEFT_EYE = [362, 263, 386]
            self.RIGHT_EYE = [33, 133, 159]
        except Exception as e:
            logger.error(f"Failed to initialize VideoAnalyzer: {str(e)}")
            raise

    async def analyze_video(self, video_content: Union[bytes, BytesIO]) -> Dict:
        logger.info("Starting video analysis")
        if isinstance(video_content, bytes):
            video_content = BytesIO(video_content)
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_file:
            temp_file.write(video_content.read())
            temp_file.flush()
            temp_file_path = temp_file.name
        
        try:
            result = await self._analyze_video_file(temp_file_path)
            logger.info(f"Video analysis completed. Result: {result}")
            return result
        except Exception as e:
            logger.error(f"Error in video analysis: {str(e)}", exc_info=True)
            raise
        finally:
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                logger.error(f"Failed to delete temp file: {e}")

    async def _analyze_video_file(self, video_file):
        cap = cv2.VideoCapture(video_file)
        if not cap.isOpened():
            logger.error(f"Failed to open video file: {video_file}")
            return {"error": "Video file could not be opened."}

        # 임계값을 위한 큐
        emotion_queue = deque(maxlen=15)
        movement_queue = deque(maxlen=10)
        gaze_movement_queue = deque(maxlen=20)

        # 기본 변수 정보 초기화
        current_emotion = "중립"
        movement_focus_score = 50
        gaze_focus_score = 50
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
            faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
            if len(faces) > 0:
                (x, y, w, h) = max(faces, key=lambda f: f[2] * f[3])
                face_roi = frame[y:y+h, x:x+w]
                face_roi = Image.fromarray(cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB))
                face_roi = self.apply_face_enhancement(face_roi)
                face_roi = self.transform(face_roi).unsqueeze(0).to(self.device)
                
                with torch.no_grad():
                    prediction = self.model(face_roi)
                    probabilities = torch.nn.functional.softmax(prediction, dim=1)
                    max_prob, emotion_idx = torch.max(probabilities, dim=1)
                    detected_emotion = self.emotions[emotion_idx.item()]
                    confidence = max_prob.item()
                    
                    if confidence > 0.6:
                        emotion_queue.append(detected_emotion)
                        current_emotion = self._smooth_emotions(emotion_queue)
            
            # 포즈 추정 (Pose Estimation)
            pose_results = self.pose.process(rgb_frame)
            if pose_results.pose_landmarks:
                current_landmarks = pose_results.pose_landmarks.landmark
                movement = self._calculate_movement(current_landmarks, previous_landmarks)
                movement_queue.append(movement)
                avg_movement = sum(movement_queue) / len(movement_queue)
                
                if avg_movement > 0.05:
                    movement_focus_score = max(0, movement_focus_score - 0.1)
                else:
                    movement_focus_score = min(100, movement_focus_score + 0.1)
                
                previous_landmarks = current_landmarks
            
            # 시선 추적 (Gaze Tracking)
            
            face_mesh_results = self.face_mesh.process(rgb_frame)
            if face_mesh_results.multi_face_landmarks:
                mesh_points = np.array([np.multiply([p.x, p.y], [frame.shape[1], frame.shape[0]]).astype(int) 
                                        for p in face_mesh_results.multi_face_landmarks[0].landmark])
                
                left_iris = mesh_points[self.LEFT_IRIS]
                right_iris = mesh_points[self.RIGHT_IRIS]
                left_eye = mesh_points[self.LEFT_EYE]
                right_eye = mesh_points[self.RIGHT_EYE]
                
                left_ratio = self.get_iris_ratio(left_iris, left_eye[:2])
                right_ratio = self.get_iris_ratio(right_iris, right_eye[:2])
                
                left_ear = self.get_eye_aspect_ratio(left_eye)
                right_ear = self.get_eye_aspect_ratio(right_eye)
                avg_ear = (left_ear + right_ear) / 2
                
                if prev_left_ratio is not None and prev_right_ratio is not None:
                    left_movement = abs(left_ratio - prev_left_ratio)
                    right_movement = abs(right_ratio - prev_right_ratio)
                    avg_movement = (left_movement + right_movement) / 2
                    gaze_movement_queue.append(avg_movement)
                    moving_avg = sum(gaze_movement_queue) / len(gaze_movement_queue)
                    
                    if avg_ear < 0.2:
                        pass
                    elif moving_avg > 0.08:
                        gaze_focus_score = max(0, gaze_focus_score - 0.2)
                    else:
                        gaze_focus_score = min(100, gaze_focus_score + 0.08)
                
                prev_left_ratio = left_ratio
                prev_right_ratio = right_ratio

        cap.release()
        
        # 최종 결과 반환
        result = {
            "current_emotion": current_emotion,
            "movement_focus": round(movement_focus_score, 2),
            "gaze_focus": round(gaze_focus_score, 2),
            "time_series_data": time_series_data
        }
        logger.info(f"Final video analysis result: {result}")
        return result

    def get_iris_ratio(self,iris_landmarks, eye_landmarks):
        eye_width = np.linalg.norm(eye_landmarks[1] - eye_landmarks[0])
        iris_center = np.mean(iris_landmarks, axis=0)
        left_edge_dist = np.linalg.norm(iris_center - eye_landmarks[0])
        right_edge_dist = np.linalg.norm(iris_center - eye_landmarks[1])
        iris_width = right_edge_dist - left_edge_dist
        return iris_width / eye_width

    def get_eye_aspect_ratio(self,eye_landmarks):
        vertical_dist = np.linalg.norm(eye_landmarks[1] - eye_landmarks[2])
        horizontal_dist = np.linalg.norm(eye_landmarks[0] - eye_landmarks[1])
        return vertical_dist / horizontal_dist
    
    def apply_face_enhancement(self,face_roi):
        face_roi = cv2.cvtColor(np.array(face_roi), cv2.COLOR_RGB2BGR)
        face_roi = cv2.detailEnhance(face_roi, sigma_s=10, sigma_r=0.15)
        face_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB)
        return Image.fromarray(face_roi)
    
    def _smooth_emotions(self, emotion_queue):
        if not emotion_queue:
            return "중립"
        emotion_counts = {emotion: emotion_queue.count(emotion) for emotion in emotion_queue}
        most_common = max(emotion_counts, key=emotion_counts.get)
        return most_common if emotion_counts[most_common] / len(emotion_queue) >= 0.6 else "중립"

    def _calculate_movement(self, current_landmarks, previous_landmarks):
        if previous_landmarks is None:
            return 0
        return sum(np.linalg.norm(
            np.array([current_landmarks[i].x, current_landmarks[i].y]) -
            np.array([previous_landmarks[i].x, previous_landmarks[i].y])
        ) for i in range(11, 23))

    
class AsyncMediaPipe:
    def __init__(self, mp_pose, mp_face_mesh):
        self.mp_pose = mp_pose
        self.mp_face_mesh = mp_face_mesh
        self.pose = None
        self.face_mesh = None

    async def __aenter__(self):
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True
        )
        return self.pose, self.face_mesh

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.pose:
            self.pose.close()
        if self.face_mesh:
            self.face_mesh.close()
