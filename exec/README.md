### **포팅 매뉴얼**

### **1. GitLab 소스 클론 이후 빌드 및 배포 관련 문서**

1. **사용한 JVM, 웹 서버, WAS 제품 및 설정**
    - **JVM:** OpenJDK 17
    - **WAS:** FastAPI(Uvicorn) 및 Spring Boot
    - **설정값 및 버전:**
        - FastAPI (Python 3.9 이상 필요)
        - PyTorch 2.3.1 (CUDA 12.1 및 cuDNN 9.3 포함)
        - Spring Boot 애플리케이션의 개발 환경(`Dspring.profiles.active=dev`) 설정
2. **빌드 시 사용되는 환경 변수**
    - **Python 애플리케이션:**
        - `requirements.txt`에 명시된 패키지를 pip로 설치.
    - **Java 애플리케이션:**
        - JAR 파일 경로: `build/libs/portAlio-0.0.1-SNAPSHOT.jar`
    - **타임존 설정:** `Asia/Seoul`
3. **배포 시 특이사항**
    - **Python FastAPI:** `Dockerfile-pytorch`를 이용하여 Docker 이미지를 생성하고, FastAPI 서버 실행.
    - **Spring Boot:** `Dockerfile-springboot`를 이용하여 JAR 파일을 Docker 이미지로 실행.
    - 실행 포트:
        - FastAPI: 8000
        - Spring Boot: 8080
4. **DB 접속 정보**
    - ERD에 따라 DB 접속 계정 및 URL 설정 필요.
    - Spring Boot `application.properties` 또는 `application.yml` 파일에 DB 접속 정보 설정:
        
        ```yaml
        spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
        spring.datasource.url=jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DB}
        spring.datasource.username=${MYSQL_USER}
        spring.datasource.password=${MYSQL_PASSWORD}
        
        ```
        

---

### **2. 프로젝트에서 사용하는 외부 서비스 정보**

1. **필요한 외부 서비스**
    - **AWS (S3, RDS):** AI 모델 파일 업로드 및 데이터베이스 사용
    - **Google Cloud Services:** Speech-to-Text 및 Text-to-Speech API 활용
    - **포톤 클라우드 (예시):** 실시간 데이터 처리에 활용 가능
2. **인증 정보**
    - 각 서비스의 API Key 또는 인증서를 환경 변수로 관리.
    - 예: `GOOGLE_APPLICATION_CREDENTIALS` 환경 변수에 인증 파일 경로 설정.

---

### **3. DB 덤프 파일 최신본**

- 최신 DB 덤프 파일 경로: `/db_backup/latest_dump.sql`
- 복원 명령 예시:
    
    ```bash
    bash
    코드 복사
    mysql -u <USERNAME> -p <DB_NAME> < /db_backup/latest_dump.sql
    
    ```
    

---

### **4. 시연 시나리오**

1. **목표**
    - AI 모델 기반 FastAPI 실행
    - Spring Boot 애플리케이션 구동
2. **시연 순서**
    - **FastAPI 서버 실행**
        1. `http://localhost:8000` 접속
        2. 제공된 API 엔드포인트 테스트 (`/predict`, `/process`)
    - **Spring Boot 애플리케이션**
        1. `http://localhost:8080` 접속
        2. 주요 페이지 로드 및 기능 테스트 (로그인, 데이터 처리)

### **1. OpenJDK 17 기반 Spring Boot 애플리케이션 Docker 설정**

### **1.1 Dockerfile 구성**

1. OpenJDK 17 기반의 Docker 이미지를 사용합니다.
2. `Asia/Seoul` 타임존을 설정합니다.
3. Gradle로 빌드된 `.jar` 파일을 복사하여 Docker 이미지에 포함합니다.
4. 애플리케이션 실행 시 필요한 JVM 옵션과 Spring Profile을 설정하여 컨테이너를 실행합니다.

### **1.2 Dockerfile 내용**
