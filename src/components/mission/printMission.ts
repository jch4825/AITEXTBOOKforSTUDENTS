import type { MissionBlock } from '../../types';

function expressionText(value: any, choices: { id: string; label: string }[] = []): string {
  if (!value) return '';
  if (Array.isArray(value.choiceIds)) {
    return value.choiceIds
      .map((id: string) => choices.find((choice) => choice.id === id)?.label || id)
      .join(', ');
  }
  if (typeof value.text === 'string' && value.text.trim()) return value.text;
  if (value.drawing) return '그림으로 표현했어요.';
  return '표현했어요.';
}

export function printMission(
  type: 'worksheet' | 'certificate',
  studentName: string,
  answers: Record<string, any>,
  lessonTitle: string,
  moduleTitle: string,
  allBlocks: MissionBlock[]
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('팝업 차단이 설정되어 있습니다. 팝업 차단을 해제하고 다시 시도해 주세요.');
    return;
  }

  const nameText = studentName.trim() || '학생';
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let htmlContent = '';

  if (type === 'certificate') {
    // Certificate Template (상장)
    htmlContent = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>수료증 - ${nameText}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 40px;
            font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
            background-color: #faf7f2;
            color: #2b3a55;
            height: 100vh;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .border-outer {
            width: 100%;
            height: 100%;
            border: 8px double #2b3a55;
            padding: 30px;
            box-sizing: border-box;
            position: relative;
            background-color: #ffffff;
            display: flex;
            flex-col: column;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            text-align: center;
          }
          .border-inner {
            width: 100%;
            height: 100%;
            border: 2px solid #b07a4f;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
          }
          .cert-title {
            font-size: 54px;
            font-weight: bold;
            letter-spacing: 12px;
            margin: 10px 0;
            color: #2b3a55;
          }
          .cert-subtitle {
            font-size: 18px;
            color: #8a8378;
            margin-bottom: 20px;
          }
          .cert-body {
            font-size: 22px;
            line-height: 2;
            color: #2d2a26;
            margin: 30px 0;
            font-weight: 500;
          }
          .name-highlight {
            font-size: 28px;
            font-weight: bold;
            text-decoration: underline;
            color: #2b3a55;
          }
          .cert-footer {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: auto;
            padding: 0 40px;
            box-sizing: border-box;
          }
          .date {
            font-size: 18px;
            color: #5c564e;
          }
          .signature {
            font-size: 20px;
            font-weight: bold;
            color: #2b3a55;
            text-align: right;
          }
          .badge-seal {
            position: absolute;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: #fcf6e8;
            border: 3px dashed #b07a4f;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
          }
        </style>
      </head>
      <body>
        <div class="border-outer">
          <div class="border-inner">
            <div class="cert-subtitle">${moduleTitle}</div>
            <div class="cert-title">수 료 증</div>
            
            <div class="cert-body">
              <span class="name-highlight">${nameText}</span><br>
              위 학생은 인공지능 교과서의<br>
              <strong>[${moduleTitle}]</strong> 과정을 성실히 공부하고<br>
              모든 미션을 훌륭하게 완수하였으므로 이 증서를 줍니다.
            </div>

            <div class="badge-seal">🏅</div>

            <div class="cert-footer">
              <div class="date">${today}</div>
              <div class="signature">
                인공지능 친구 아이미 & 박민준 선생님
              </div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;
  } else {
    // Worksheet Template (학습지)
    let contentRowsHtml = '';

    allBlocks.forEach((block) => {
      const val = answers[block.id];
      if (block.kind === 'summary') return; // Skip summary blocks in print worksheet to avoid duplicate tables

      let answerHtml = '';

      if (val === undefined) {
        answerHtml = '<span style="color:#aaa; font-style:italic;">수행하지 않음</span>';
      } else {
        if (block.kind === 'multi-pick') {
          const arr = val as string[];
          answerHtml = arr.map(item => `<span class="badge">${item}</span>`).join(' ');
        } else if (block.kind === 'single-pick') {
          answerHtml = `<span class="badge">${val}</span>`;
        } else if (block.kind === 'drag-sort') {
          const sortMap = val as Record<string, number>;
          const binGroups: Record<string, string[]> = {};
          block.bins.forEach(bin => { binGroups[bin.emoji + ' ' + bin.label] = []; });
          Object.entries(sortMap).forEach(([cardIdxStr, binIdx]) => {
            const cardIdx = parseInt(cardIdxStr, 10);
            const card = block.cards[cardIdx];
            const bin = block.bins[binIdx];
            if (card && bin) {
              binGroups[bin.emoji + ' ' + bin.label].push(card.label);
            }
          });
          answerHtml = Object.entries(binGroups)
            .map(([bin, cards]) => `<strong>${bin}</strong>: ${cards.join(', ') || '-'}`)
            .join('<br>');
        } else if (block.kind === 'drag-build') {
          const slots = val as (number | null)[];
          const words = slots.map(pieceIdx => {
            if (pieceIdx === null) return '____';
            return block.pieces[pieceIdx]?.label || '____';
          });
          answerHtml = `<span style="font-weight:bold; font-size:16px;">"${words.join(' ')}"</span>`;
        } else if (block.kind === 'branch-chat') {
          const choicesIdx = val as number[];
          const chosenText: string[] = [];
          choicesIdx.forEach((choiceIdx, turnIdx) => {
            const choice = block.turns[turnIdx]?.choices[choiceIdx];
            if (choice) chosenText.push(choice.label);
          });
          answerHtml = chosenText.map((t, i) => `${i+1}. ${t}`).join('<br>');
        } else if (block.kind === 'scene-hunt') {
          const found = val as string[];
          answerHtml = found.map(f => `<span class="badge">${f}</span>`).join(' ');
        } else if (block.kind === 'vow') {
          const parts = block.template.split(/(\{이름\}|\{빈칸\})/g);
          const vowSentence = parts.map(part => {
            if (part === '{이름}') return `<strong>${nameText}</strong>`;
            if (part === '{빈칸}') return `<u>&nbsp;&nbsp;${val || '____'}&nbsp;&nbsp;</u>`;
            return part;
          }).join('');
          answerHtml = `<span style="font-size:16px; font-weight:bold;">${vowSentence}</span>`;
        } else if (block.kind === 'draw') {
          answerHtml = `<div class="drawing-img-box"><img src="${val}" style="max-height:220px; max-width:100%; object-fit:contain; border:1px solid #ddd; background:#fff; padding:4px; border-radius:8px;" /></div>`;
        } else if (block.kind === 'judgment-preview') {
          answerHtml = `<span class="badge">${expressionText(val.firstThought, block.choices)}</span>`;
          if (val.reason) answerHtml += `<br><span>${expressionText(val.reason, block.reasonCards || [])}</span>`;
        }
      }

      const promptText = block.kind === 'branch-chat'
        ? block.intro
        : block.kind === 'judgment-preview'
          ? block.scenario.title
          : (block as any).prompt;

      contentRowsHtml += `
        <div class="block-section">
          <div class="block-prompt">📄 ${promptText}</div>
          <div class="block-answer">${answerHtml}</div>
        </div>
      `;
    });

    htmlContent = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>${lessonTitle} 미션 활동지</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
            color: #2d2a26;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            background: #ffffff;
          }
          .header {
            border-bottom: 3px double #2b3a55;
            padding-bottom: 12px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .title-area h1 {
            font-size: 26px;
            margin: 0;
            color: #2b3a55;
          }
          .title-area p {
            font-size: 14px;
            color: #8a8378;
            margin: 4px 0 0 0;
          }
          .info-area {
            font-size: 16px;
            font-weight: bold;
            color: #2d2a26;
          }
          .info-area span {
            border-bottom: 2px solid #2b3a55;
            padding: 0 10px;
          }
          .block-section {
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          .block-prompt {
            font-size: 15px;
            font-weight: bold;
            color: #2b3a55;
            margin-bottom: 8px;
          }
          .block-answer {
            background-color: #fcf6e8;
            border-left: 4px solid #b07a4f;
            padding: 12px 16px;
            border-radius: 0 8px 8px 0;
            font-size: 14px;
          }
          .badge {
            display: inline-block;
            background-color: #ffffff;
            border: 1px solid #e3ddd2;
            padding: 4px 10px;
            border-radius: 12px;
            margin: 2px;
            font-weight: bold;
            color: #2b3a55;
          }
          .drawing-img-box {
            text-align: center;
            margin-top: 5px;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e3ddd2;
            padding-top: 10px;
            text-align: center;
            font-size: 12px;
            color: #8a8378;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title-area">
            <h1>${lessonTitle} 미션 활동지</h1>
            <p>${moduleTitle}</p>
          </div>
          <div class="info-area">
            이름: <span>&nbsp;&nbsp;${nameText}&nbsp;&nbsp;</span>
          </div>
        </div>

        <div class="content">
          ${contentRowsHtml}
        </div>

        <div class="footer">
          발달장애 학생을 위한 AI 온라인 교과서 • ${today} 출력
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;
  }

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
