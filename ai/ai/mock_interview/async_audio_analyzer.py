from locale import normalize
from fastapi import HTTPException
import librosa
import numpy as np
from io import BytesIO
from google.cloud import speech_v1
from typing import Dict, Tuple
from pydub import AudioSegment
import os
import logging

logger = logging.getLogger(__name__)

class AsyncAudioAnalyzer:
    def __init__(self):
        self.speech_client = speech_v1.SpeechClient()

    def _preprocess_audio(self, audio_content: bytes) -> bytes:
        """오디오 전처리: 노이즈 감소, 볼륨 정규화, 무음 제거"""
        try:
            with BytesIO(audio_content) as audio_buffer:
                # 오디오 로드
                audio = AudioSegment.from_file(audio_buffer)
                
                # 모노로 변환
                audio = audio.set_channels(1)
                
                # 샘플레이트 변환 (16kHz)
                audio = audio.set_frame_rate(16000)
                
                # 볼륨 정규화 (normalize()는 AudioSegment의 메소드)
                normalized_audio = audio.normalize()
                
                # 무음 구간 처리 (1초 이상 무음은 줄임)
                processed_audio = normalized_audio.strip_silence(
                    silence_len=1000,  # 1초
                    silence_thresh=-40,  # -40 dB
                    padding=100  # 100ms
                )
                
                # WAV 형식으로 변환
                output = BytesIO()
                processed_audio.export(
                    output, 
                    format='wav', 
                    parameters=[
                        "-ar", "16000",    # 샘플레이트
                        "-ac", "1",        # 채널 수
                        "-sample_fmt", "s16"  # 16비트 PCM
                    ]
                )
                
                return output.getvalue()

        except Exception as e:
            logger.error(f"Audio preprocessing failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"오디오 전처리 중 오류가 발생했습니다: {str(e)}"
            )

    def stt_transcribe(self, audio_content: bytes) -> str:
        """향상된 Google STT 음성 인식"""
        try:
            # 오디오 전처리
            processed_audio = self._preprocess_audio(audio_content)
            
            # STT 설정
            config = speech_v1.RecognitionConfig(
                encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code="ko-KR",
                enable_word_time_offsets=True,
                enable_automatic_punctuation=True,
                use_enhanced=True,
                model="default",  # 기본 모델 사용
                audio_channel_count=1,
                enable_separate_recognition_per_channel=False,
                max_alternatives=1,
                profanity_filter=False,
            )
            
            # 음성 인식 수행
            audio = speech_v1.RecognitionAudio(content=processed_audio)
            response = self.speech_client.recognize(config=config, audio=audio)

            # 결과 처리
            transcript = " ".join([
                result.alternatives[0].transcript 
                for result in response.results
            ])
            
            return transcript.strip()
            
        except Exception as e:
            logger.error(f"STT transcription failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"음성 인식 처리 중 오류가 발생했습니다: {str(e)}"
            )

    def analyze_speech(self, audio_content: bytes) -> Dict:
        """향상된 음성 분석"""
        try:
            # 오디오 전처리
            processed_audio = self._preprocess_audio(audio_content)
            
            # STT 설정
            config = speech_v1.RecognitionConfig(
                encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code="ko-KR",
                enable_word_time_offsets=True,
                enable_automatic_punctuation=True,
                use_enhanced=True,
                model="default",
                audio_channel_count=1
            )
            
            audio = speech_v1.RecognitionAudio(content=processed_audio)
            response = self.speech_client.recognize(config=config, audio=audio)

            return self._process_speech_response(response)
            
        except Exception as e:
            logger.error(f"Speech analysis failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="음성 분석 중 오류가 발생했습니다"
            )

    def _process_speech_response(self, response) -> Dict:
        """향상된 음성 분석 결과 처리"""
        analysis = {
            "transcript": "",
            "words": [],
            "pronunciation_issues": [],
            "sentence_breaks": []
        }

        for result in response.results:
            alternative = result.alternatives[0]
            analysis["transcript"] += alternative.transcript + " "

            prev_end_time = 0
            for word_info in alternative.words:
                start_time = word_info.start_time.total_seconds()
                end_time = word_info.end_time.total_seconds()
                
                # 비정상적으로 긴 시간 간격 조정
                if start_time - prev_end_time > 2.0:
                    start_time = prev_end_time + 0.3
                
                duration = end_time - start_time
                
                # 단어 정보 저장
                word_data = {
                    "word": word_info.word,
                    "confidence": word_info.confidence,
                    "start_time": start_time,
                    "end_time": end_time,
                    "duration": duration
                }
                
                analysis["words"].append(word_data)

                # 발음 문제 감지 (신뢰도가 낮은 경우)
                if word_info.confidence < 0.8:
                    issue = {
                        "word": word_info.word,
                        "confidence": word_info.confidence,
                        "timestamp": {
                            "start": start_time,
                            "end": end_time
                        },
                        "suggestion": "이 단어의 발음을 더 명확히 해주세요"
                    }
                    analysis["pronunciation_issues"].append(issue)

                # 문장 끝 감지
                if word_info.word.strip()[-1] in ['.', '?', '!', ',']:
                    analysis["sentence_breaks"].append(end_time)
                
                prev_end_time = end_time

        return analysis

    def analyze_audio_file(self, audio_content: bytes) -> Dict:
        """향상된 오디오 속성 분석"""
        try:
            # 오디오 전처리
            processed_audio = self._preprocess_audio(audio_content)
            
            # Librosa 분석
            with BytesIO(processed_audio) as temp_file:
                temp_file.seek(0)
                y, sr = librosa.load(temp_file, sr=16000)  # 16kHz로 통일
            
            # 속도 분석
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

            # RMS 에너지 분석
            rms = librosa.feature.rms(y=y)[0]
            rms_std = np.std(rms)

            # 무음 구간 분석 (더 엄격한 기준)
            intervals = librosa.effects.split(
                y, 
                top_db=30,  # 더 엄격한 무음 감지
                frame_length=2048,
                hop_length=512
            )
            
            total_speech = sum(interval[1] - interval[0] for interval in intervals)
            silence_duration = len(y) - total_speech
            silence_ratio = silence_duration / len(y)

            # 유창성 점수
            fluency_score = 1 - silence_ratio

            return {
                "속도(BPM)": float(tempo),
                "볼륨 떨림 정도(RMS 표준편차)": float(round(rms_std, 2)),
                "무음 비율": float(round(silence_ratio, 2)),
                "유창성 점수": float(round(fluency_score, 2))
            }
            
        except Exception as e:
            logger.error(f"Audio file analysis failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="오디오 분석 중 오류가 발생했습니다"
            )
