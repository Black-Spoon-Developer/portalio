from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class JobData(BaseModel):
    recrutPbancTtl: str
    instNm: str
    srcUrl: str
    workRgnNmLst: str
    ncsCdNmLst: str
    hireTypeNmLst: str
    recrutSeNm: str
    pbancBgngYmd: str
    pbancEndYmd: str

class CategoryRequest(BaseModel):
    job_categories: List[int]

class TransformedJob(BaseModel):
    recrutPbancTtl: str
    instNm: str
    srcUrl: str
    workRgnNmLst: str
    jobCategories: List[int]
    hireTypeNmLst: str
    recrutSeNm: str
    pbancBgngYmd: str
    pbancEndYmd: str

class NcsResponse(BaseModel):
    ncs_categories: List[str]
    matching_jobs: List[TransformedJob]

NCS_MAPPING = {
    "사업관리": [1],
    "경영.회계.사무": [1, 3, 4, 5],
    "법률.경찰.소방.교도.국방": [5],
    "건설": [12],
    "기계": [11],
    "재료": [11],
    "화학": [14],
    "전기.전자": [6],
    "정보통신": [6],
    "환경.에너지.안전": [11],
    "연구": [14],
    "교육.자연.사회과학": [15],
    "보건.의료": [13],
    "문화.예술.디자인.방송": [7, 16]
}

def load_job_data() -> List[Dict]:
    json_path = os.getenv("JOB_DATA_PATH")
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('result', []) if isinstance(data, dict) else []
    except Exception as e:
        print(f"Error loading job data: {str(e)}")
        return []

def check_ncs_categories_match(ncs_list: str, job_categories: List[int]) -> bool:
    matched_categories = set()
    ncs_items = ncs_list.split(',')
    
    for ncs in ncs_items:
        if ncs in NCS_MAPPING:
            matched_categories.update(NCS_MAPPING[ncs])
    
    return any(cat in matched_categories for cat in job_categories)

def transform_job(job: Dict, job_categories: List[int]) -> Optional[TransformedJob]:
    try:
        if not check_ncs_categories_match(job["ncsCdNmLst"], job_categories):
            return None
            
        ncs_categories = set()
        for ncs in job["ncsCdNmLst"].split(','):
            if ncs in NCS_MAPPING:
                ncs_categories.update(NCS_MAPPING[ncs])
                
        return TransformedJob(
            recrutPbancTtl=job["recrutPbancTtl"],
            instNm=job["instNm"],
            srcUrl=job["srcUrl"],
            workRgnNmLst=job["workRgnNmLst"],
            jobCategories=sorted(list(ncs_categories)),
            hireTypeNmLst=job["hireTypeNmLst"],
            recrutSeNm=job["recrutSeNm"],
            pbancBgngYmd=job["pbancBgngYmd"],
            pbancEndYmd=job["pbancEndYmd"]
        )
    except Exception as e:
        print(f"Error transforming job: {str(e)}")
        return None

@router.post("/categories")
async def get_ncs_categories(request: CategoryRequest) -> NcsResponse:
    jobs_data = load_job_data()
    if not jobs_data:
        raise HTTPException(status_code=500, detail="Failed to load job data")

    matching_jobs = []
    for job in jobs_data:
        transformed = transform_job(job, request.job_categories)
        if transformed:
            matching_jobs.append(transformed)

    if not matching_jobs:
        raise HTTPException(status_code=404, detail="해당하는 공고가 없습니다")

    ncs_categories = [
        ncs for ncs, cats in NCS_MAPPING.items()
        if any(cat in request.job_categories for cat in cats)
    ]

    return NcsResponse(
        ncs_categories=ncs_categories,
        matching_jobs=matching_jobs
    )
