import torch
from transformers import GPT2LMHeadModel, PreTrainedTokenizerFast

# KoGPT2 모델과 토크나이저 불러오기
model_name = "skt/kogpt2-base-v2"
model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer = PreTrainedTokenizerFast.from_pretrained(model_name, bos_token='</s>', eos_token='</s>', unk_token='<unk>')

# GPU가 있다면 GPU로 이동
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# 하드코딩된 .md 파일 경로
md_file_path = "summary.md"  # 실제 파일 경로로 변경

# .md 파일에서 텍스트 읽어오기
with open(md_file_path, "r", encoding="utf-8") as file:
    portfolio_text = file.read()

# 한국어 프롬프트 샘플 추가
context_prompt = f"{portfolio_text}\n경험 면접 질문 예시: 본인이 주도적으로 해결한 프로젝트 경험은 무엇인가요? 프로젝트에서 어려운 점은 무엇이었나요?\n\n"

# 경험 면접 질문 5개를 생성
num_questions = 5
generated_questions = []

for i in range(num_questions):
    input_ids = tokenizer.encode(f"{context_prompt}경험 면접 질문 {i + 1}:", return_tensors='pt').to(device)
    sample_output = model.generate(
        input_ids,
        max_new_tokens=30,  # 새로 생성할 토큰의 최대 길이
        num_beams=2,         # 빔 서치 사용
        no_repeat_ngram_size=2,  # 반복 방지
        early_stopping=True
    )
    # 생성된 텍스트를 디코딩 후 질문 저장
    generated_text = tokenizer.decode(sample_output[0], skip_special_tokens=True)
    question = generated_text.replace(portfolio_text, "").strip()  # 포트폴리오 텍스트 부분 제거
    generated_questions.append(question)

# 생성된 질문 출력
for idx, question in enumerate(generated_questions, 1):
    print(f"경험 면접 질문 {idx}: {question}")
