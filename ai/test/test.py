import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import sys

# 필요한 패키지 설치
try:
    import transformers
except ImportError:
    os.system('pip install transformers torch safetensors accelerate')

# 모델과 토크나이저 설정 함수
def load_model():
    model_id = 'MLP-KTLim/llama-3-Korean-Bllossom-8B'
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        torch_dtype=torch.bfloat16,
        device_map="auto",
    )
    model.eval()
    return model, tokenizer

# 요약 생성 함수
def generate_summary(file_path, model, tokenizer):
    # 프롬프트 설정
    PROMPT = "You are a helpful AI assistant. Please summarize the given document concisely. 당신은 문서를 간결하게 요약하는 AI 어시스턴트입니다."
    summary_request = "다음 문서를 요약해 주세요:"

    # .md 파일 읽기
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            document_text = file.read()
    except FileNotFoundError:
        print(f"오류: 파일 '{file_path}'을 찾을 수 없습니다.")
        sys.exit(1)

    # 요약 요청 메시지 설정
    messages = [
        {"role": "system", "content": f"{PROMPT}"},
        {"role": "user", "content": f"{summary_request}\n\n{document_text}"}
    ]

    # 입력 텍스트 토큰화
    input_ids = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        return_tensors="pt"
    ).to(model.device)

    # 종료 토큰 설정
    terminators = [
        tokenizer.eos_token_id,
        tokenizer.convert_tokens_to_ids("<|eot_id|>")
    ]

    # 요약 생성
    outputs = model.generate(
        input_ids,
        max_new_tokens=512,  # 요약의 최대 길이
        eos_token_id=terminators,
        pad_token_id=tokenizer.eos_token_id,  # `pad_token_id`를 `eos_token_id`와 동일하게 설정
        attention_mask=input_ids.ne(tokenizer.pad_token_id),  # `attention_mask` 추가
        do_sample=True,
        temperature=0.6,
        top_p=0.9
    )

    # 요약 결과 반환
    return tokenizer.decode(outputs[0][input_ids.shape[-1]:], skip_special_tokens=True)

# main 함수
if __name__ == "__main__":
    model, tokenizer = load_model()
    # 파일 경로를 하드코딩
    file_path = ".md"  # 예시 파일 경로 설정
    summary = generate_summary(file_path, model, tokenizer)
    print("요약 결과:")
    print(summary)
