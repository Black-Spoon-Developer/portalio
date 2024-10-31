import cv2
import mediapipe as mp
import numpy as np
from collections import deque

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.5, min_tracking_confidence=0.5)

cap = cv2.VideoCapture(0)

# 동공과 눈의 좌우 끝점 랜드마크
LEFT_IRIS = [474, 475, 476, 477]
RIGHT_IRIS = [469, 470, 471, 472]
LEFT_EYE = [362, 263, 386]
RIGHT_EYE = [33, 133, 159]

focus_score = 100

# 동공 위치 추적을 위한 변수
prev_left_ratio = None
prev_right_ratio = None
movement_threshold = 0.04
stability_counter = 0
max_stability = 30

# 이동 평균을 위한 큐
movement_queue = deque(maxlen=10)

# 눈 깜빡임 관련 변수
blink_counter = 0
max_blinks = 5
blink_cooldown = 0
max_blink_cooldown = 30

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

while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("카메라에서 프레임을 읽을 수 없습니다.")
        break

    image = cv2.flip(image, 1)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_image)

    if results.multi_face_landmarks:
        mesh_points = np.array([np.multiply([p.x, p.y], [image.shape[1], image.shape[0]]).astype(int) 
                                for p in results.multi_face_landmarks[0].landmark])
        
        left_iris = mesh_points[LEFT_IRIS]
        right_iris = mesh_points[RIGHT_IRIS]
        left_eye = mesh_points[LEFT_EYE]
        right_eye = mesh_points[RIGHT_EYE]

        left_ratio = get_iris_ratio(left_iris, left_eye[:2])
        right_ratio = get_iris_ratio(right_iris, right_eye[:2])

        left_ear = get_eye_aspect_ratio(left_eye)
        right_ear = get_eye_aspect_ratio(right_eye)
        avg_ear = (left_ear + right_ear) / 2

        # 눈 깜빡임 감지 및 처리
        if avg_ear < 0.4:  # 눈 깜빡임 임계값 조정
            blink_counter += 1
            if blink_counter > max_blinks and blink_cooldown == 0:
                focus_score = max(0, focus_score - 0.01)  # 눈 깜빡임으로 인한 감소량 줄임
                blink_cooldown = max_blink_cooldown
        else:
            blink_counter = 0

        if blink_cooldown > 0:
            blink_cooldown -= 1

        # 동공 움직임 추적
        if prev_left_ratio is not None and prev_right_ratio is not None:
            left_movement = abs(left_ratio - prev_left_ratio)
            right_movement = abs(right_ratio - prev_right_ratio)
            
            avg_movement = (left_movement + right_movement) / 2
            movement_queue.append(avg_movement)

            # 이동 평균 계산
            moving_avg = sum(movement_queue) / len(movement_queue)
            
            if moving_avg > movement_threshold:
                focus_score = max(0, focus_score - 0.2)  # 감소량 미세 조정
                stability_counter = 0
            else:
                stability_counter += 1
                if stability_counter > max_stability:
                    focus_score = min(100, focus_score + 0.03)  # 증가량 미세 조정
                    stability_counter = max_stability
        
        prev_left_ratio = left_ratio
        prev_right_ratio = right_ratio

        # 동공 위치 시각화
        for iris_points in [left_iris, right_iris]:
            (cx, cy), radius = cv2.minEnclosingCircle(iris_points)
            center = np.array([cx, cy], dtype=np.int32)
            cv2.circle(image, center, int(radius), (255,0,255), 1, cv2.LINE_AA)

    # 집중도 표시
    cv2.putText(image, f"Focus Score: {int(focus_score)}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow('MediaPipe Eye Tracking', image)
    
    if cv2.waitKey(5) & 0xFF == ord('q'):
        print("프로그램을 종료합니다.")
        break

cap.release()
cv2.destroyAllWindows()