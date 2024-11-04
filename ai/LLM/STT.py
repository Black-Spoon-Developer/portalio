import pyaudio
import wave
import threading
import queue
from google.cloud import speech_v1p1beta1 as speech
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/SSAFY/Desktop/JSON key/BSD.json"

# 오디오 설정
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
RECORD_SECONDS = 20  # 답변 시간 제한

# Google Cloud 클라이언트 초기화
speech_client = speech.SpeechClient()

# 작업 큐 초기화
task_queue = queue.Queue()

def record_audio(filename):
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
    print("* 녹음 시작")
    frames = []
    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)
    print("* 녹음 완료")
    stream.stop_stream()
    stream.close()
    p.terminate()
    wf = wave.open(filename, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

def transcribe_file(speech_file):
    with open(speech_file, "rb") as audio_file:
        content = audio_file.read()
    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=RATE,
        language_code="ko-KR",
        use_enhanced=True,
        model="latest_long",
    )
    response = speech_client.recognize(config=config, audio=audio)
    return response.results[0].alternatives[0].transcript if response.results else ""

def process_audio(filename, question_number):
    transcript = transcribe_file(filename)
    print(f"답변 {question_number}: {transcript}")
    # 여기에 분석 코드 추가
    # analyze_answer(transcript, question_number)

def worker():
    while True:
        task = task_queue.get()
        if task is None:
            break
        filename, question_number = task
        process_audio(filename, question_number)
        task_queue.task_done()

# 작업자 스레드 시작
worker_thread = threading.Thread(target=worker)
worker_thread.start()

def main():
    questions = ["첫 번째 질문입니다.", "두 번째 질문입니다.", "세 번째 질문입니다."]
    
    for i, question in enumerate(questions, 1):
        answer_file = f"answer_{i}.wav"
        
        print(f"질문 {i}: {question}")
        
        # 답변 녹음
        record_audio(answer_file)
        
        # 답변 처리를 큐에 추가
        task_queue.put((answer_file, i))

    # 모든 작업이 완료될 때까지 대기
    task_queue.join()

    # 작업자 스레드 종료
    task_queue.put(None)
    worker_thread.join()

if __name__ == "__main__":
    main()