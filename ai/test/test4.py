import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from kobert_transformers import get_kobert_model, get_tokenizer  # KoBERT 전용 토크나이저 및 모델

# Polyglot-Ko 및 KoBERT 모델과 토크나이저 로드
polyglot_model_name = "EleutherAI/polyglot-ko-1.3b"  # Polyglot-Ko 경로
polyglot_model = AutoModelForCausalLM.from_pretrained(polyglot_model_name)
polyglot_tokenizer = AutoTokenizer.from_pretrained(polyglot_model_name)

# KoBERT 모델과 토크나이저 불러오기
kobert_model = get_kobert_model()
kobert_tokenizer = get_tokenizer()

# GPU가 있다면 GPU로 이동
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
polyglot_model.to(device)
kobert_model.to(device)

# 하드코딩된 .md 파일 경로
md_file_path = "summary.md"  # 실제 파일 경로로 변경

# .md 파일에서 텍스트 읽어오기
with open(md_file_path, "r", encoding="utf-8") as file:
    portfolio_text = file.read()

# KoBERT를 이용하여 텍스트 요약 (간단한 요약을 위한 예시)
kobert_inputs = kobert_tokenizer(portfolio_text, return_tensors='pt', truncation=True, max_length=512).to(device)
kobert_outputs = kobert_model(**kobert_inputs)
summary_embedding = kobert_outputs.last_hidden_state.mean(dim=1).squeeze()
summary_text = " ".join([f"주요 키워드: 프로젝트, 리더십, 성과"])  # 요약 결과를 기반으로 키워드 추가

# Polyglot-Ko에 전달할 프롬프트 작성
context_prompt = f"{summary_text}\n경험 면접 질문 예시: 본인이 주도적으로 해결한 프로젝트 경험은 무엇인가요?\n\n"

# 경험 면접 질문 5개를 생성
num_questions = 5
generated_questions = []

for i in range(num_questions):
    # 프롬프트와 함께 입력 토큰 변환
    inputs = polyglot_tokenizer(f"{context_prompt}경험 면접 질문 {i + 1}:", return_tensors='pt').to(device)
    input_ids = inputs['input_ids']
    attention_mask = inputs['attention_mask']
    
    # 텍스트 생성
    sample_output = polyglot_model.generate(
        input_ids,
        attention_mask=attention_mask,  # Attention mask 추가
        max_new_tokens=50,             # 생성할 텍스트 길이 제한
        num_beams=2,                   # 빔 서치 크기 설정
        no_repeat_ngram_size=2,        # 반복 방지
        early_stopping=True,
        pad_token_id=polyglot_tokenizer.eos_token_id  # PAD 토큰을 EOS 토큰으로 설정
    )
    
    # 생성된 텍스트 디코딩 후 질문 저장
    generated_text = polyglot_tokenizer.decode(sample_output[0], skip_special_tokens=True)
    question = generated_text.replace(context_prompt, "").strip()  # 프롬프트 제거하여 질문만 추출
    generated_questions.append(question)

# 요약 결과와 생성된 질문 출력
print(f"KoBERT 요약 내용:\n{summary_text}\n")
for idx, question in enumerate(generated_questions, 1):
    print(f"경험 면접 질문 {idx}: {question}")
