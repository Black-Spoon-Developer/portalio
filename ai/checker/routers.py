from textblob import TextBlob
from ai.checker.services import check_spelling_and_grammar
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from ai.checker.schemas import TextCorrectionRequestDTO, TextCorrectionResponseDTO

router = APIRouter()

# def format_text_with_line_breaks(text: str) -> str:
#     """
#     TextBlob을 사용하여 문장 단위로 분리하고 줄바꿈을 추가하는 함수
#     """
#     blob = TextBlob(text)
#     formatted_text = "\n".join([str(sentence) for sentence in blob.sentences])
#     return formatted_text

@router.post("/correct", response_model=TextCorrectionResponseDTO)
async def correct_text(request: TextCorrectionRequestDTO):
    # 입력된 텍스트에서 교정 수행
    # try:
    #     formatted_content = format_text_with_line_breaks(request.content)
    # except Exception as e:
    #     raise HTTPException(status_code=400, detail=f"Text formatting error: {str(e)}")

    try:
        correction_result = await check_spelling_and_grammar(request.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Spell check error: {str(e)}")

    # 응답 DTO로 반환
    return TextCorrectionResponseDTO(recom=correction_result)