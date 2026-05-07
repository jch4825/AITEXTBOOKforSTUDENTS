"""Convert basic_standards.csv (cp949) to SKILL.md-compatible UTF-8 CSV.

Source columns (cp949):
  교과, 학년군, 성취기준 코드, 성취기준 제목, 성취기준 설명(A), 성취기준 설명(B), 성취기준 설명(C)

Target columns (utf-8) per SKILL.md:
  code, subject, gradeGroup, 성취기준, 성취수준 상, 성취수준 중, 성취수준 하

Grade-group integer (2/4/6/9/12) maps to label:
  2 -> 1~2학년, 4 -> 3~4학년, 6 -> 5~6학년, 9 -> 7~9학년, 12 -> 10~12학년
"""
import csv
import sys

GRADE_MAP = {
    "1": "1~2학년", "2": "1~2학년",
    "3": "3~4학년", "4": "3~4학년",
    "5": "5~6학년", "6": "5~6학년",
    "7": "중학교 1~3학년", "8": "중학교 1~3학년", "9": "중학교 1~3학년",
    "10": "고등학교 1~3학년", "11": "고등학교 1~3학년", "12": "고등학교 1~3학년",
}

SRC = sys.argv[1]
DST = sys.argv[2]

with open(SRC, "r", encoding="cp949", newline="") as fin, \
     open(DST, "w", encoding="utf-8", newline="") as fout:
    reader = csv.reader(fin)
    writer = csv.writer(fout)
    header = next(reader)
    writer.writerow(["code", "subject", "gradeGroup", "성취기준", "성취수준 상", "성취수준 중", "성취수준 하"])
    n = 0
    for row in reader:
        if not row or len(row) < 7:
            continue
        subject, grade_raw, code, title, a, b, c = row[0], row[1], row[2], row[3], row[4], row[5], row[6]
        if not code.strip() or not subject.strip():
            continue
        grade_label = GRADE_MAP.get(grade_raw.strip(), grade_raw.strip())
        writer.writerow([code, subject, grade_label, title, a, b, c])
        n += 1
print(f"converted {n} rows -> {DST}")
