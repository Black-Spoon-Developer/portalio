import cv2
import numpy as np
import torch
import torchvision.transforms as transforms
from PIL import Image, ImageDraw, ImageFont

# PyTorch 모델 정의 (ResNet50을 사용한다고 가정)
from torchvision.models import resnet50

# 모델 로드
model = resnet50(weights=None)
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 7)  # 7개의 감정 클래스
model.load_state_dict(torch.load('C:/Users/SSAFY/Desktop/2학기 자율/Data/final_model.pth'))
model.eval()

# GPU 사용 가능 여부 확인
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model.to(device)

# 감정 클래스
emotions = ["기쁨", "당황", "분노", "불안", "상처", "슬픔", "중립"]

# 얼굴 검출기 로드
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# 웹캠 초기화
cap = cv2.VideoCapture(0)

# 한글 폰트 경로 (시스템에 맞는 폰트 경로로 변경해야 함)
font_path = "C:/Windows/Fonts/malgun.ttf"
font = ImageFont.truetype(font_path, 20)

# 이미지 전처리
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

# 감정 카운트 초기화
emotion_counts = {emotion: 0 for emotion in emotions}

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    for (x, y, w, h) in faces:
        face_roi = frame[y:y+h, x:x+w]
        face_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB)
        face_roi = Image.fromarray(face_roi)
        face_roi = transform(face_roi).unsqueeze(0).to(device)

        with torch.no_grad():
            prediction = model(face_roi)
            emotion_index = prediction.argmax().item()
            emotion = emotions[emotion_index]
            emotion_counts[emotion] += 1  # 감정 카운트 증가
            print(f"Current Emotion: {emotion}")  # 현재 감정 출력

        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        frame = put_korean_text(frame, emotion, (x, y-30), font)

    cv2.imshow('Emotion Recognition', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("Emotion Counts:")
        for emotion, count in emotion_counts.items():
            print(f"{emotion}: {count}")
        break

cap.release()
cv2.destroyAllWindows()