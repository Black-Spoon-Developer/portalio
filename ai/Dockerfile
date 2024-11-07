# 1. PyTorch와 CUDA, cuDNN이 포함된 베이스 이미지 선택
# 이 이미지는 GPU를 활용하여 AI 모델을 가속화하기 위해 사용
# pytorch/pytorch 이미지는 CUDA와 cuDNN이 포함되어 있어, 별도의 설치 없이 GPU를 사용할 수 있게 해준다
# 프로젝트에 사용된 PyTorch 버전(2.3.1)과 CUDA(12.1), cuDNN(9.3) 버전에 맞추어 설정
FROM pytorch/pytorch:2.3.1-cuda12.1-cudnn9.3-runtime

# 2. 작업 디렉토리 설정
# Docker 컨테이너 내부에서 코드가 저장되고 실행될 디렉토리를 지정한다
# /app 디렉토리를 만들고 이곳을 현재 작업 디렉토리로 설정하여 이후 명령들이 이 디렉토리에서 실행되도록 한다.
WORKDIR /app

# 3. 의존성 설치를 위한 requirements.txt 파일 복사
# 로컬에 있는 requirements.txt 파일을 Docker 이미지 내의 /app 디렉토리로 복사한다.
# 이 파일에는 AI 모델을 실행하는 데 필요한 Python 라이브러리들이 정의되어 있다.
COPY requirements.txt .

# 4. 필요한 Python 라이브러리 설치
# requirements.txt 파일에 정의된 라이브러리들을 설치한다.
# --no-cache-dir 옵션은 캐시를 사용하지 않도록 하여 Docker 이미지의 용량을 줄여준다.
# 이 단계에서 opencv-python, torch, torchvision 등 모델 실행에 필요한 모든 라이브러리가 설치된다.
RUN pip install --no-cache-dir -r requirements.txt

# 5. 소스 코드 전체 복사
# 현재 디렉토리의 모든 파일과 폴더를 Docker 컨테이너 내의 /app 디렉토리로 복사한다.
# 이 과정에서 FastAPI 앱 파일(app.py)과 모델 파일, 기타 코드가 모두 컨테이너에 포함된다.
COPY . .

# 6. FastAPI 서버 실행
# FastAPI를 사용해 AI 모델을 API로 제공할 수 있도록 서버를 실행한다.
# uvicorn은 FastAPI 애플리케이션을 실행하는 서버이다.
# "app:app"은 "app.py" 파일 내의 FastAPI 인스턴스(app)를 실행한다는 의미다.
# --host 0.0.0.0은 외부에서 접속할 수 있도록 설정하는 옵션이고, --port 8000은 서버가 8000번 포트에서 실행되도록 한다.
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
