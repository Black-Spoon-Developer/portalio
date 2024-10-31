import cv2
import mediapipe as mp
import numpy as np
import time

# MediaPipe Pose 초기화
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# 카메라 초기화
cap = cv2.VideoCapture(0)

# 움직임 분석을 위한 변수
previous_landmarks = None
focus_score = 100  # 초기 점수 100으로 설정
last_update_time = time.time()

# 이동 평균을 위한 큐
movement_queue = []
queue_max_size = 10

def calculate_movement(current_landmarks, previous_landmarks):
    if previous_landmarks is None:
        return 0
    
    movement = 0
    for i in range(11, 23):  # 상체 랜드마크 (11-22)
        current_point = np.array([current_landmarks[i].x, current_landmarks[i].y])
        previous_point = np.array([previous_landmarks[i].x, previous_landmarks[i].y])
        movement += np.linalg.norm(current_point - previous_point)
    
    return movement

while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("카메라에서 프레임을 읽을 수 없습니다.")
        break

    image = cv2.flip(image, 1)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_image)

    if results.pose_landmarks:
        current_landmarks = results.pose_landmarks.landmark
        
        # 움직임 계산
        movement = calculate_movement(current_landmarks, previous_landmarks)
        
        # 움직임 큐에 추가
        movement_queue.append(movement)
        if len(movement_queue) > queue_max_size:
            movement_queue.pop(0)
        
        # 평균 움직임 계산
        avg_movement = sum(movement_queue) / len(movement_queue)
        
        # 포즈 점수 업데이트
        current_time = time.time()
        if current_time - last_update_time > 0.1:  # 0.1초마다 업데이트
            if avg_movement > 0.05:  # 움직임 임계값
                focus_score = max(0, focus_score - 0.5)  # 점수 감소
            else:
                focus_score = min(100, focus_score + 0.2)  # 점수 증가
            last_update_time = current_time
        
        # 랜드마크 그리기
        mp.solutions.drawing_utils.draw_landmarks(
            image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
            mp.solutions.drawing_utils.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2),
            mp.solutions.drawing_utils.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
        )
        
        previous_landmarks = current_landmarks

    # 포즈 점수 표시
    cv2.putText(image, f"focus Score: {int(focus_score)}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow('Interview Pose Analysis', image)
    
    # 'q' 또는 'ESC' 키를 누르면 종료
    key = cv2.waitKey(5) & 0xFF
    if key == ord('q') or key == 27:  # 27 is the ASCII code for ESC
        print("프로그램을 종료합니다.")
        break

cap.release()
cv2.destroyAllWindows()