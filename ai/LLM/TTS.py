import os
from google.cloud import texttospeech
import pygame
import time

# Google Cloud 서비스 계정 키 파일 경로 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\SSAFY\\Desktop\\2학기 공통\\LLM\\AIchatbot\\llm.json"

# Google Cloud 클라이언트 생성
tts_client = texttospeech.TextToSpeechClient()

def synthesize_text(text, output_audio_file):
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="ko-KR",
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    response = tts_client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    with open(output_audio_file, "wb") as out:
        out.write(response.audio_content)
    print(f"Audio content written to file {output_audio_file}")

def play_audio(file):
    pygame.mixer.init()
    pygame.mixer.music.load(file)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        time.sleep(0.1)

def main():
    while True:
        text = input("텍스트를 입력하세요 (종료하려면 'q' 입력): ")
        if text.lower() == 'q':
            break
        output_file = "output.mp3"
        synthesize_text(text, output_file)
        play_audio(output_file)

if __name__ == "__main__":
    main()