import os
import pyaudio
import numpy as np
from google.cloud import speech_v1p1beta1 as speech
import time 
import wave
import datetime

# Google Cloud 인증 정보 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/SSAFY/Desktop/JSON key/BSD.json"

# 오디오 설정
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 48000
RECORD_SECONDS = 20  # 녹음 시간 (초)

def recognize_speech_from_mic(speech_client):
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

    print("말씀해 주세요...")
    frames = []

    for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK, exception_on_overflow=False)
        frames.append(data)

    print("음성 입력 완료.")
    stream.stop_stream()
    stream.close()
    p.terminate()

    # 음성 파일 저장
    filename = save_audio(frames)
    print(f"음성 파일이 저장되었습니다: {filename}")

    return process_speech(speech_client, frames), filename

def save_audio(frames):
    # 현재 시간을 파일 이름으로 사용
    current_time = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"audio_{current_time}.wav"
    
    wf = wave.open(filename, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(pyaudio.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()
    
    return filename

def process_speech(speech_client, frames):
    audio_content = b''.join(frames)
    audio = speech.RecognitionAudio(content=audio_content)
    
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=RATE,
        language_code="ko-KR",
        use_enhanced=True,
        model="latest_long",
        enable_automatic_punctuation=True,
    )

    try:
        response = speech_client.recognize(config=config, audio=audio)
        return " ".join(result.alternatives[0].transcript for result in response.results)
    except Exception as e:
        print(f"음성 인식 실패: {e}")
        return ""

def main():
    speech_client = speech.SpeechClient()
    
    while True:
        user_input, audio_filename = recognize_speech_from_mic(speech_client)
        if user_input:
            print(f"인식된 음성: {user_input}")
            print(f"음성 파일: {audio_filename}")
        else:
            print("음성을 인식하지 못했습니다. 다시 시도해주세요.")
        
        print("\n다시 시도하려면 Enter를 누르세요. 종료하려면 'q'를 입력하세요.")
        if input().lower() == 'q':
            break

if __name__ == "__main__":
    main()