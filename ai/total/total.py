import cv2
import torch
import torchvision.transforms as transforms
from PIL import Image, ImageDraw, ImageFont
from torchvision.models import resnet50
import numpy as np
from collections import deque
import mediapipe as mp
import time

# 모델 설정
model = resnet50(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, 7)
model.load_state_dict(torch.load('C:/Users/SSAFY/Desktop/2학기 자율/Data/final_model.pth'))
model.eval()
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model.to(device)

emotions = ["기쁨", "당황", "분노", "불안", "상처", "슬픔", "중립"]
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
font = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 20)

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

# 카메라 초기화
cap = cv2.VideoCapture(0)

# 변수 초기화
current_emotion = "중립"
emotion_queue = deque(maxlen=15)
confidence_threshold = 0.6
emotion_stability_threshold = 0.6

movement_focus_score = 100
gaze_focus_score = 100

previous_landmarks = None
last_update_time = time.time()
movement_queue = deque(maxlen=10)

LEFT_IRIS = [474, 475, 476, 477]
RIGHT_IRIS = [469, 470, 471, 472]
LEFT_EYE = [362, 263, 386]
RIGHT_EYE = [33, 133, 159]

prev_left_ratio = None
prev_right_ratio = None


movement_threshold = 0.05  # 더 낮은 값으로 조정
gaze_movement_queue = deque(maxlen=20)  # 큐 크기 증가
stability_counter = 0
max_stability = 50  # 안정성 카운터 증가

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
    return most_common if stability >= emotion_stability_threshold else "중립"

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

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
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

        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        frame = put_korean_text(frame, current_emotion, (x, y-30), font)

    # 포즈 추정
    pose_results = pose.process(rgb_frame)
    if pose_results.pose_landmarks:
        current_landmarks = pose_results.pose_landmarks.landmark
        movement = calculate_movement(current_landmarks, previous_landmarks)
        movement_queue.append(movement)
        avg_movement = sum(movement_queue) / len(movement_queue)
        
        current_time = time.time()
        if current_time - last_update_time > 0.1:
            if avg_movement > 0.05:
                movement_focus_score = max(0, movement_focus_score - 0.3)
            else:
                movement_focus_score = min(100, movement_focus_score + 0.2)
            last_update_time = current_time
        
        mp.solutions.drawing_utils.draw_landmarks(
            frame, pose_results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
            mp.solutions.drawing_utils.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2),
            mp.solutions.drawing_utils.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
        )
        
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

        for iris_points in [left_iris, right_iris]:
            (cx, cy), radius = cv2.minEnclosingCircle(iris_points)
            center = np.array([cx, cy], dtype=np.int32)
            cv2.circle(frame, center, int(radius), (255,0,255), 1, cv2.LINE_AA)

    # 정보 표시
    frame = put_korean_text(frame, f"현재 감정: {current_emotion}", (10, 30), font)
    frame = put_korean_text(frame, f"움직임 집중도: {int(movement_focus_score)}", (10, 60), font)
    frame = put_korean_text(frame, f"시선 집중도: {int(gaze_focus_score)}", (10, 90), font)

    cv2.imshow('Interview Analysis', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()