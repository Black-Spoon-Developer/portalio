import os
import json
from PIL import Image
from PIL import ImageOps
import numpy as np
import re
from collections import Counter
import shutil

DATA_ROOT_DIR = "./emotiondata/data/Validation"
PROCESSED_FACES_DIR = "./processed_faces"
LABEL_DATA = {}

def extract_datetime_info(filename):
    match = re.search(r'_(\d{14}-\d{3}-\d{3})', filename)
    return match.group(1) if match else None

def process_label_data(label_dir):
    for root, _, files in os.walk(label_dir):
        for file in files:
            if file.endswith('.json'):
                with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for item in data:
                        image_name = item['filename']
                        datetime_info = extract_datetime_info(image_name)
                        if datetime_info:
                            LABEL_DATA[datetime_info] = {
                                'emotion_A': item['annot_A']['faceExp'],
                                'emotion_B': item['annot_B']['faceExp'],
                                'emotion_C': item['annot_C']['faceExp'],
                                'gender': item['gender'],
                                'age': item['age'],
                                'boxes': item['annot_A']['boxes']  # Using annot_A's boxes for simplicity
                            }

def preprocess_image(img):
    img = ImageOps.exif_transpose(img)
    return img

def crop_and_save_face(img_path, label_info, emotion):
    try:
        with Image.open(img_path) as img:
            img = preprocess_image(img)  # 인공지능 전처리 적용

            boxes = label_info['boxes']
            x1, y1, x2, y2 = int(boxes['minX']), int(boxes['minY']), int(boxes['maxX']), int(boxes['maxY'])
            face = img.crop((x1, y1, x2, y2))
            face = face.resize((224, 224))
            
            emotion_dir = os.path.join(PROCESSED_FACES_DIR, emotion)
            os.makedirs(emotion_dir, exist_ok=True)
            
            base_name = os.path.basename(img_path)
            save_path = os.path.join(emotion_dir, f"processed_{base_name}")
            face.save(save_path)
            
            return save_path
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
    
    return None

def get_majority_emotion(emotions):
    counter = Counter(emotions)
    if len(set(emotions)) == 3:  # 모든 감정이 다른 경우
        return None
    return counter.most_common(1)[0][0]  # 가장 많이 나온 감정 반환

def process_image(img_path):
    datetime_info = extract_datetime_info(os.path.basename(img_path))
    if datetime_info in LABEL_DATA:
        emotions = [LABEL_DATA[datetime_info][f'emotion_{annotator}'] for annotator in ['A', 'B', 'C']]
        majority_emotion = get_majority_emotion(emotions)
        if majority_emotion:
            processed_path = crop_and_save_face(img_path, LABEL_DATA[datetime_info], majority_emotion)
            if processed_path:
                return {
                    'processed_image': processed_path,
                    'emotion': majority_emotion,
                    'gender': LABEL_DATA[datetime_info]['gender'],
                    'age': LABEL_DATA[datetime_info]['age']
                }
    return None

def process_images(source_dir):
    img_list = [os.path.join(root, file) 
                for root, _, files in os.walk(source_dir) 
                for file in files if file.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif'))]
    
    processed_data = []
    for img_path in img_list:
        result = process_image(img_path)
        if result:
            processed_data.append(result)
    
    return processed_data

def main():
    emotions = ["당황", "분노", "불안", "상처", "슬픔", "중립"]
    
    # 기존 processed_faces 디렉토리 삭제 후 재생성
    if os.path.exists(PROCESSED_FACES_DIR):
        shutil.rmtree(PROCESSED_FACES_DIR)
    os.makedirs(PROCESSED_FACES_DIR)
    
    for emotion in emotions:
        label_dir = os.path.join(DATA_ROOT_DIR, f"[라벨]EMOIMG_{emotion}_VALID")
        process_label_data(label_dir)
        
        source_dir = os.path.join(DATA_ROOT_DIR, f"[원천]EMOIMG_{emotion}_VALID")
        processed_data = process_images(source_dir)
        
        print(f"Processed {len(processed_data)} images for emotion: {emotion}")
        print("Sample data:")
        for item in processed_data[:5]:
            print(f"Image: {item['processed_image']}")
            print(f"Emotion: {item['emotion']}")
            print(f"Gender: {item['gender']}")
            print(f"Age: {item['age']}")
            print("---")

if __name__ == "__main__":
    main()