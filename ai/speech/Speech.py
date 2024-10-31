import librosa
import numpy as np
import matplotlib.pyplot as plt

def analyze_interview_audio(file_path):
    # 오디오 파일 로드
    y, sr = librosa.load(file_path)

    # 1. 속도 분석 (말하는 속도)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

    # 2. 목소리 떨림 (Pitch Variation)
    # pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    # pitches = pitches[pitches > 0]
    # pitch_std = np.std(pitches)

    # 3. 음성 안정성 및 끊김 분석
    rms = librosa.feature.rms(y=y)[0]
    rms_std = np.std(rms)

    # 4. 무음 구간 분석
    intervals = librosa.effects.split(y, top_db=20)
    total_speech = sum(interval[1] - interval[0] for interval in intervals)
    silence_duration = len(y) - total_speech
    silence_ratio = silence_duration / len(y)

    # 5. 유창성 (Fluency) - 간단한 근사치
    fluency_score = 1 - silence_ratio

    # 결과 출력
    print(f"음성 속도평균(BPM): {tempo[0]}")
    # print(f"Pitch variation (표준편차): {pitch_std:.2f}")
    print(f"볼륨 크기(RMS 표준편차): {rms_std:.2f}")
    print(f"무음 구간 분석: {silence_ratio:.2f}")
    print(f"유창성: {fluency_score:.2f}")

    # 시각화
    plt.figure(figsize=(12, 8))
    
    plt.subplot(3, 1, 1)
    librosa.display.waveshow(y, sr=sr)
    plt.title('Waveform')

    plt.subplot(3, 1, 2)
    S = librosa.feature.melspectrogram(y=y, sr=sr)
    librosa.display.specshow(librosa.power_to_db(S, ref=np.max), y_axis='mel', x_axis='time')
    plt.title('Mel Spectrogram')

    plt.subplot(3, 1, 3)
    times = librosa.times_like(rms)
    plt.plot(times, rms)
    plt.title('RMS Energy')

    plt.tight_layout()
    plt.show()

# 사용 예
file_path = "C:/Users/SSAFY/Desktop/2학기 공통/LLM/AIchatbot/1234.mp3"
analyze_interview_audio(file_path)