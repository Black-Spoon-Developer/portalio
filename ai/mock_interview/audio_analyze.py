from fastapi import HTTPException
import librosa
import numpy as np
from io import BytesIO
from google.cloud import speech_v1
from typing import Dict, List

class AudioAnalyzer:
    def __init__(self):
        self.speech_client = speech_v1.SpeechClient()

    def stt_transcribe(self, audio_content: bytes) -> str:
        """Google STT를 이용하여 음성을 텍스트로 변환"""
        audio = speech_v1.RecognitionAudio(content=audio_content)
        config = speech_v1.RecognitionConfig(
            encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="ko-KR",
            enable_word_time_offsets=True,
            enable_automatic_punctuation=True,
            # model="video",
            use_enhanced=True,
            enable_speaker_diarization=False,
            profanity_filter=False,
            audio_channel_count=1
        )

        try:
            response = self.speech_client.recognize(config=config, audio=audio)
            transcript = " ".join([result.alternatives[0].transcript for result in response.results])
            return transcript
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"음성 인식 처리 중 오류가 발생했습니다: {str(e)}"
            )

    def analyze_audio_file(self, audio_content: bytes) -> Dict:
        """Librosa로 음성 속성 분석 (속도, 유창성, 무음 비율)"""
        # Temp file for librosa loading
        with BytesIO(audio_content) as temp_file:
            temp_file.seek(0)
            y, sr = librosa.load(temp_file, sr=None)
        
        # 속도 분석 (말하는 속도)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

        # RMS 에너지 분석 (음성 떨림)
        rms = librosa.feature.rms(y=y)[0]
        rms_std = np.std(rms)

        # 무음 구간 분석
        intervals = librosa.effects.split(y, top_db=20)
        total_speech = sum(interval[1] - interval[0] for interval in intervals)
        silence_duration = len(y) - total_speech
        silence_ratio = silence_duration / len(y)

        # 유창성 (Fluency)
        fluency_score = 1 - silence_ratio

        return {
            "속도(BPM)": tempo,
            "볼륨 떨림 정도(RMS 표준편차)": round(rms_std, 2),
            "무음 비율": round(silence_ratio, 2),
            "유창성 점수": round(fluency_score, 2)
        }

    def analyze_speech(self, audio_content: bytes) -> Dict:
        """Google STT를 이용한 음성 인식 및 발음 문제, 타임스탬프 분석"""
        config = speech_v1.RecognitionConfig(
            encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="ko-KR",
            enable_word_time_offsets=True,
            enable_automatic_punctuation=True,
            # model="video",
            use_enhanced=True,
            audio_channel_count=1
        )
        audio = speech_v1.RecognitionAudio(content=audio_content)
        response = self.speech_client.recognize(config=config, audio=audio)

        analysis_result = {
            "transcript": "",
            "words": [],
            "pronunciation_issues": [],
            "sentence_breaks": []
        }

        for result in response.results:
            alternative = result.alternatives[0]
            analysis_result["transcript"] += alternative.transcript + " "

            # 단어별 분석
            for word_info in alternative.words:
                word_data = {
                    "word": word_info.word,
                    "confidence": word_info.confidence,
                    "start_time": word_info.start_time.total_seconds(),
                    "end_time": word_info.end_time.total_seconds(),
                    "duration": word_info.end_time.total_seconds() - word_info.start_time.total_seconds()
                }
                
                analysis_result["words"].append(word_data)

                # 발음 문제 감지
                if word_info.confidence < 0.8:
                    issue = {
                        "word": word_info.word,
                        "confidence": word_info.confidence,
                        "timestamp": {
                            "start": word_info.start_time.total_seconds(),
                            "end": word_info.end_time.total_seconds()
                        },
                        "suggestion": "이 단어의 발음을 더 명확히 해주세요"
                    }
                    analysis_result["pronunciation_issues"].append(issue)

                # 문장 끝 감지
                if word_info.word.strip()[-1] in ['.', '?', '!']:
                    analysis_result["sentence_breaks"].append(
                        word_info.end_time.total_seconds()
                    )

        return analysis_result
