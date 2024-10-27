## 구현 기획
### 크롤링
1. [부산대학교](https://nara-speller.co.kr/speller/) - 500자 제약
2. [인크루트](https://lab.incruit.com/editor/spell/)

### 직접 구현
1. TF-IDF
2. NLP
3. LLM
4. ko-sroberta-multitask
--> 물론 유사도 구현 같은 경우에는 포트폴리오 쪽 조언 등에서나 사용하는게 맞을 것으로 생각됨

### open source
1. hunspell


### 데이터셋
1. [문법 교정](https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&dataSetSn=71477)

### 구현 순서
1. hunspell 을 통한 맞춤법 검사 구현
  - 교정 추천 구현
  - 맞춤법 검사 구현
2. 시간이 된다면 문법 검사 구현이 필요
  - 일단은 chat GPT API를 사용하는게 V1
  - 최종적으론 학습을 거친 모델을 만들어야함
    - 문법 검사기 관련 논문 : 품사 분류 관련 지도 등
    - NLTK
      - Ko~ 모델로 갈 경우 분류 가능
    - TF-IDF
3. 이에 맞는 모델 중 Koelectra 모델
4. class 로 묶어서 맞춤법 진행하고 문법 검사