from fastapi import File, UploadFile, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import Union
from transformers import ElectraTokenizer, ElectraForTokenClassification
from bs4 import BeautifulSoup
import markdown
import re
import torch
from pykospacing import Spacing
import os

os.environ["CUDA_LAUNCH_BLOCKING"] = "1"

router = APIRouter()

model_dir = "C:\\Users\\SSAFY\\Desktop\\Port_Alio\\S11P31D202\\ai\\spelling"
tokenizer = ElectraTokenizer.from_pretrained(model_dir)
model = ElectraForTokenClassification.from_pretrained(model_dir, ignore_mismatched_sizes=True)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

error_type_to_label = {
    "spac": 1,
    "spellgram": 2,
    "trn": 3,
    "other": 4
}

spacing = Spacing()

def spell_check(word: str) -> str:
    # PyKoSpacing은 문장 단위로 교정을 수행하므로, 단어를 문장처럼 처리하여 교정합니다.
    return spacing(word)

# Markdown 파일에서 텍스트 추출
def extract_text_from_md(file_content: str) -> str:
    html_content = markdown.markdown(file_content)
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text()
    return text

# 코드 블록 및 불필요한 내용 제거
def remove_code_blocks(text: str) -> str:
    code_pattern = r'```.*?```'
    cleaned_text = re.sub(code_pattern, '', text, flags=re.DOTALL)
    return cleaned_text

# 문장 단위로 텍스트 분리
def split_into_sentences(text: str):
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return sentences

# 입력 텍스트 준비
def prepare_input(text: str):
    inputs = tokenizer(text, padding="max_length", truncation=True, max_length=128, return_tensors="pt")
    inputs = {key: value.to('cuda') for key, value in inputs.items()}
    return inputs

# 오류 감지 함수
def predict_errors(text: str):
    inputs = prepare_input(text)
    model.eval()
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.argmax(outputs.logits, dim=-1)
        predictions = predictions[0].cpu().numpy()

    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    labels = predictions

    error_positions = []
    for idx, label in enumerate(labels):
        if label != 0:  # 0은 오류 없음
            error_type = list(error_type_to_label.keys())[label - 1]
            error_positions.append((tokens[idx], error_type))

    return error_positions

# 오류 교정 함수
def apply_corrections(sentence: str, errors):
    for token, error_type in errors:
        if error_type == "spac":
            sentence = sentence.replace(token, token + " ")
        elif error_type == "spellgram":
            corrected_word = spell_check(token)  # 맞춤법 검사 라이브러리 사용 필요
            sentence = sentence.replace(token, corrected_word)
        elif error_type == "trn":
            sentence = sentence.replace(token, "대체된 텍스트")
    return sentence

# 텍스트 교정 함수
def correct_text(text: str):
    sentences = split_into_sentences(text)
    corrected_text = ""

    for sentence in sentences:
        errors = predict_errors(sentence)
        corrected_sentence = apply_corrections(sentence, errors)
        corrected_text += corrected_sentence + " "

    return corrected_text.strip()

# 전체 흐름
def process_md_file(file_content: str) -> str:
    extracted_text = extract_text_from_md(file_content)
    non_code_text = remove_code_blocks(extracted_text)
    corrected_text = correct_text(non_code_text)
    return corrected_text

# FastAPI 엔드포인트 설정
@router.post("/upload_md/")
async def upload_md(file: UploadFile = File(...)):
    if not file.filename.endswith(".md"):
        raise HTTPException(status_code=400, detail="Only .md files are allowed.")
    
    file_content = await file.read()
    corrected_text = process_md_file(file_content.decode("utf-8"))
    return JSONResponse(content={"corrected_text": corrected_text})