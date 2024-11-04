# stt.py

import io
import os
from google.cloud import speech_v1p1beta1 as speech
import pyaudio
import time

# Google Cloud 인증 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/SSAFY/Desktop/JSON key/BSD.json"

def speech_to_text(duration):
    client = speech.SpeechClient()
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="ko-KR",
        enable_automatic_punctuation=True,
    )
    streaming_config = speech.StreamingRecognitionConfig(
        config=config, interim_results=True
    )

    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)

    print("답변을 시작하세요...")
    start_time = time.time()
    audio_generator = lambda: (
        speech.StreamingRecognizeRequest(audio_content=chunk)
        for chunk in iter(lambda: stream.read(1024), b"")
    )

    responses = client.streaming_recognize(streaming_config, audio_generator())

    full_transcript = ""
    for response in responses:
        if time.time() - start_time > duration:
            break
        if not response.results:
            continue
        result = response.results[0]
        if not result.alternatives:
            continue
        transcript = result.alternatives[0].transcript
        if result.is_final:
            full_transcript += transcript + " "
            print(f"인식된 텍스트: {transcript}")

    stream.stop_stream()
    stream.close()
    p.terminate()

    return full_transcript.strip()

def main():
    questions = [
        "자기소개를 해주세요.",
        "지원 동기는 무엇인가요?",
        "본인의 장점과 단점은 무엇인가요?",
        "5년 후 본인의 모습을 어떻게 그리고 있나요?",
        "마지막으로 하고 싶은 말씀이 있다면 해주세요."
    ]

    answers = []

    for i, question in enumerate(questions, 1):
        print(f"\n질문 {i}: {question}")
        input("답변 준비가 되면 Enter를 누르세요...")
        
        answer = speech_to_text(60)  # 60초 동안 답변 녹음
        answers.append(answer)

    print("\n면접 결과:")
    for i, (question, answer) in enumerate(zip(questions, answers), 1):
        print(f"\n질문 {i}: {question}")
        print(f"답변: {answer}")

    # 결과를 파일로 저장
    with open("interview_results.txt", "w", encoding="utf-8") as f:
        for i, (question, answer) in enumerate(zip(questions, answers), 1):
            f.write(f"질문 {i}: {question}\n")
            f.write(f"답변: {answer}\n\n")

if __name__ == "__main__":
    main()