#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    print("❌ pandas가 필요합니다. 설치 중...")
    os.system("pip install pandas openpyxl")
    import pandas as pd

# 파일 경로
xlsx_files = {
    "3-4": r"C:\Users\jch48\Downloads\2022 개정 교육과정 성취기준, 해설, 성취수준-3,4학년군.xlsx",
    "5-6": r"C:\Users\jch48\Downloads\2022 개정 교육과정 성취기준, 해설, 성취수준-5,6학년군.xlsx"
}

existing_json = r"C:\AI\AI_bridge_test_v0.1\src\data\curriculumStandards.json"
output_file = r"C:\AI\AI_bridge_test_v0.1\src\data\curriculumStandards.json"

# 성취수준별 평가 기준 생성
def generate_evaluation_criteria(level_a, level_b, level_c):
    """성취수준 설명으로부터 평가 기준 자동 생성"""
    criteria = {
        "A": {
            "description": level_a if isinstance(level_a, str) else "",
            "evaluationCriteria": "정확하고 완전한 이해, 명확한 표현력 평가",
            "formativeAssessment": ["실시간 관찰 평가", "구두 피드백", "개별 확인"],
            "summativeAssessment": ["수행평가", "포트폴리오 (우수 사례)", "체크리스트 (전 항목 충족)"]
        },
        "B": {
            "description": level_b if isinstance(level_b, str) else "",
            "evaluationCriteria": "적절한 수준의 이해, 적절한 표현 평가",
            "formativeAssessment": ["관찰 평가", "피드백 (보완점)", "또래 평가"],
            "summativeAssessment": ["수행평가", "포트폴리오 (표준 사례)", "체크리스트 (대부분 충족)"]
        },
        "C": {
            "description": level_c if isinstance(level_c, str) else "",
            "evaluationCriteria": "부분적 이해 확인, 개선 영역 파악",
            "formativeAssessment": ["개별 관찰", "맞춤형 피드백", "보충 학습 필요 확인"],
            "summativeAssessment": ["수행평가 (단순 버전)", "포트폴리오 (기초 사례)", "재평가 기회 제공"]
        }
    }
    return criteria

# 기존 JSON 로드
print("📖 기존 JSON 파일 로드 중...")
with open(existing_json, 'r', encoding='utf-8') as f:
    existing_data = json.load(f)
    existing_standards = existing_data.get("standards", [])
    print(f"   ✅ 기존 {len(existing_standards)}개 성취기준 로드됨 (1-2학년군)")

all_standards = existing_standards.copy()

# XLSX 파일 처리
for grade_group, xlsx_path in xlsx_files.items():
    print(f"\n📊 {grade_group}학년군 XLSX 파일 처리 중: {xlsx_path}")

    if not os.path.exists(xlsx_path):
        print(f"   ❌ 파일을 찾을 수 없습니다.")
        continue

    try:
        # Excel 파일 읽기
        df = pd.read_excel(xlsx_path)
        print(f"   📋 Sheet 로드 완료: {len(df)} 행")

        # 컬럼명 확인 및 정규화
        print(f"   📌 컬럼명: {list(df.columns)}")

        # 컬럼 이름 정규화 (앞뒤 공백 제거)
        df.columns = df.columns.str.strip()

        # 데이터 변환
        for idx, row in df.iterrows():
            # NaN 값 처리
            code = str(row.get('성취기준 코드', '')).strip() if pd.notna(row.get('성취기준 코드')) else ""
            title = str(row.get('성취기준', '')).strip() if pd.notna(row.get('성취기준')) else ""

            # 필수 필드 확인
            if not code or not title:
                continue

            level_a = str(row.get('성취수준(A)', '')).strip() if pd.notna(row.get('성취수준(A)')) else ""
            level_b = str(row.get('성취수준(B)', '')).strip() if pd.notna(row.get('성취수준(B)')) else ""
            level_c = str(row.get('성취수준(C)', '')).strip() if pd.notna(row.get('성취수준(C)')) else ""

            standard = {
                "code": code,
                "gradeGroup": grade_group,
                "subject": str(row.get('교과', '')).strip() if pd.notna(row.get('교과')) else "",
                "domain": str(row.get('영역', '')).strip() if pd.notna(row.get('영역')) else "",
                "title": title,
                "coreIdea": str(row.get('핵심 아이디어', '')).strip() if pd.notna(row.get('핵심 아이디어')) else "",
                "contentElements": str(row.get('내용요소 (지식/이해만)', '')).strip() if pd.notna(row.get('내용요소 (지식/이해만)')) else "",
                "achievementLevels": generate_evaluation_criteria(level_a, level_b, level_c),
                "description": str(row.get('해설', '')).strip() if pd.notna(row.get('해설')) else "",
                "assessmentMethods": {
                    "formative": ["관찰 평가", "실시간 피드백", "또래 평가"],
                    "summative": ["성취수준별 루브릭", "포트폴리오", "수행평가"],
                    "rubric": {
                        "A": "정확하고 높은 수준의 이해와 표현",
                        "B": "적절한 수준의 이해와 표현",
                        "C": "부분적 이해, 보충 학습 필요"
                    }
                }
            }
            all_standards.append(standard)

        print(f"   ✅ {grade_group}학년군: {len([s for s in all_standards if s['gradeGroup'] == grade_group])}개 추가됨")

    except Exception as e:
        print(f"   ❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()

# 최종 JSON 저장
print(f"\n💾 최종 JSON 파일 저장 중...")
output_data = {"standards": all_standards}

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

# 통계
print(f"\n✅ 완료!")
print(f"📊 총 성취기준: {len(all_standards)}개")
print(f"   📚 1-2학년군: {len([s for s in all_standards if s['gradeGroup'] == '1~2'])}개")
print(f"   📚 3-4학년군: {len([s for s in all_standards if s['gradeGroup'] == '3-4'])}개")
print(f"   📚 5-6학년군: {len([s for s in all_standards if s['gradeGroup'] == '5-6'])}개")
print(f"📁 저장 위치: {output_file}")
