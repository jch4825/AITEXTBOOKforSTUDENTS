#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import json
import os
from pathlib import Path

# 파일 경로
csv_file = r'C:\Users\jch48\Downloads\2022 개정 교육과정 성취기준, 해설, 성취수준 _부산실천교사_ - 1-2학년군.csv'
output_file = r'C:\AI\AI_bridge_test_v0.1\src\data\curriculumStandards.json'

# 출력 디렉토리 생성
Path(output_file).parent.mkdir(parents=True, exist_ok=True)

# 성취수준별 평가 기준 매핑 로직
def generate_evaluation_criteria(subject, domain, level_a, level_b, level_c):
    """성취수준 설명으로부터 평가 기준 자동 생성"""
    criteria = {
        "A": {
            "description": level_a,
            "evaluationCriteria": "정확하고 완전한 이해, 명확한 표현력 평가",
            "formativeAssessment": ["실시간 관찰 평가", "구두 피드백", "개별 확인"],
            "summativeAssessment": ["수행평가", "포트폴리오 (우수 사례)", "체크리스트 (전 항목 충족)"]
        },
        "B": {
            "description": level_b,
            "evaluationCriteria": "적절한 수준의 이해, 적절한 표현 평가",
            "formativeAssessment": ["관찰 평가", "피드백 (보완점)", "또래 평가"],
            "summativeAssessment": ["수행평가", "포트폴리오 (표준 사례)", "체크리스트 (대부분 충족)"]
        },
        "C": {
            "description": level_c,
            "evaluationCriteria": "부분적 이해 확인, 개선 영역 파악",
            "formativeAssessment": ["개별 관찰", "맞춤형 피드백", "보충 학습 필요 확인"],
            "summativeAssessment": ["수행평가 (단순 버전)", "포트폴리오 (기초 사례)", "재평가 기회 제공"]
        }
    }
    return criteria

try:
    standards = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            # 필수 컬럼 확인
            if not row.get('성취기준 코드') or not row.get('성취기준'):
                continue

            level_a = row.get('성취수준(A)', '').strip()
            level_b = row.get('성취수준(B)', '').strip()
            level_c = row.get('성취수준(C)', '').strip()

            # CSV 행 → 스키마 매핑
            standard = {
                "code": row['성취기준 코드'].strip(),
                "gradeGroup": row.get('학년군', '').strip(),
                "subject": row.get('교과', '').strip(),
                "domain": row.get('영역', '').strip(),
                "title": row.get('성취기준', '').strip(),
                "coreIdea": row.get('핵심\naIdeaidea', '').strip() or row.get('핵심 아이디어', '').strip(),
                "contentElements": row.get('내용요소 (지식/이해만)', '').strip(),
                "achievementLevels": generate_evaluation_criteria(
                    row.get('교과', ''),
                    row.get('영역', ''),
                    level_a,
                    level_b,
                    level_c
                ),
                "description": row.get('해설', '').strip(),
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
            standards.append(standard)

    # JSON 출력
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({"standards": standards}, f, ensure_ascii=False, indent=2)

    print(f"✅ {len(standards)}개 성취기준 변환 완료")
    print(f"📁 저장 위치: {output_file}")
    print(f"📊 포함된 교과: {len(set(s['subject'] for s in standards))}")
    print(f"📚 첫 번째 항목: {standards[0]['code']} - {standards[0]['title']}")

except FileNotFoundError:
    print(f"❌ CSV 파일을 찾을 수 없습니다: {csv_file}")
except Exception as e:
    print(f"❌ 오류 발생: {e}")
    import traceback
    traceback.print_exc()
