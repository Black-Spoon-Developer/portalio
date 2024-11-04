import cv2
import torch
import torchvision.transforms as transforms
from PIL import Image, ImageDraw, ImageFont
from torchvision.models import resnet50
import numpy as np
from collections import deque

# 모델 설정
model = resnet50(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, 7)
model.load_state_dict(torch.load('./final_model.pth'))
model.eval()
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model.to(device)

emotions = ["기쁨", "당황", "분노", "불안", "상처", "슬픔", "중립"]
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
cap = cv2.VideoCapture(0)
font = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 20)

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def put_korean_text(image, text, position, font, color=(0,255,0)):
    img_pil = Image.fromarray(image)
    draw = ImageDraw.Draw(img_pil)
    draw.text(position, text, font=font, fill=color)
    return np.array(img_pil)

current_emotion = "중립"
emotion_queue = deque(maxlen=15)  # 최근 30개의 감정을 저장
confidence_threshold = 0.6  # 신뢰도 임계값 상향 조정
emotion_stability_threshold = 0.6  # 감정 안정성 임계값

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
    # 얼굴 이미지 개선
    face_roi = cv2.cvtColor(np.array(face_roi), cv2.COLOR_RGB2BGR)
    face_roi = cv2.detailEnhance(face_roi, sigma_s=10, sigma_r=0.15)
    face_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB)
    return Image.fromarray(face_roi)

while True:
    ret, frame = cap.read()
    if not ret:
        break

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

        if confidence > confidence_threshold:
            emotion_queue.append(detected_emotion)
            current_emotion = smooth_emotions(emotion_queue)

        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        frame = put_korean_text(frame, current_emotion, (x, y-30), font)

    frame = put_korean_text(frame, f"현재 감정: {current_emotion}", (10, 30), font)

    cv2.imshow('Emotion Recognition', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()