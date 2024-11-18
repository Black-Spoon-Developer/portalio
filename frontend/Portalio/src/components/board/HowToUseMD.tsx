import React, { useState } from "react";

// 모든 Markdown 데이터
const markdownSections = [
  {
    id: 1,
    title: "텍스트 서식",
    content: `
### 글자 강조
- **굵게**: \`**텍스트**\` 또는 \`__텍스트__\`
- *기울임*: \`*텍스트*\` 또는 \`_텍스트_\`
- ***굵고 기울임***: \`***텍스트***\` 또는 \`___텍스트___\`
- ~~취소선~~: \`~~텍스트~~\`    `,
  },
  {
    id: 2,
    title: "헤더 (Header)",
    content: `
### 헤더 크기 조절
- \`# 제목\`: 가장 큰 헤더
- \`## 제목\`: 두 번째로 큰 헤더
- \`### 제목\`: 세 번째로 큰 헤더    `,
  },
  {
    id: 3,
    title: "목록",
    content: `
### 목록 생성
- 순서 없는 목록: \`-\`, \`*\`, \`+\`로 작성
  - 하위 항목은 들여쓰기

\`- 항목 1\`
\`  - 하위 항목 1.1\`

- 순서 있는 목록: 숫자와 점(\`1.\`)을 사용

\`1. 항목 1\`
\`  1.1. 하위 항목\``,
  },
  {
    id: 4,
    title: "링크",
    content: `
### 링크 작성
- 인라인 링크: \`[텍스트](URL)\`
  - \`[Google](https://www.google.com)\`    `,
  },
  {
    id: 5,
    title: "이미지",
    content: `
### 이미지 삽입
- 기본 이미지: \`![대체 텍스트](이미지 URL)\`
  - \`![예제 이미지](https://via.placeholder.com/150)\`    `,
  },
  {
    id: 6,
    title: "코드 블록",
    content: `
### 코드 작성
- 인라인 코드: \`코드 내용\`
  - 예: \`const a = 10;\`
- 멀티라인 코드 블록: \` \`\`\`언어 \`
  - 예:
    \`\`\`javascript
    const a = 10;
    console.log(a);
    \`\`\``,
  },
  {
    id: 7,
    title: "인용문",
    content: `
### 인용문
- \`>\`를 사용하여 작성

\`> 이것은 인용문입니다.\``,
  },
  {
    id: 8,
    title: "표",
    content: `
### 표 작성
| 헤더1 | 헤더2 | 헤더3 |
|-------|-------|-------|
| 데이터1 | 데이터2 | 데이터3 |
| 데이터4 | 데이터5 | 데이터6 |`,
  },
  {
    id: 9,
    title: "체크리스트",
    content: `
### 체크리스트
- \`- [ ]\`로 작성
  - \`- [x] 완료된 작업\`
  - \`- [ ] 진행 중 작업\``,
  },
  {
    id: 10,
    title: "수평선",
    content: `
### 수평선
- \`---\`, \`***\`, \`___\`로 작성

**결과:**
---
***
___
    `,
  },
  {
    id: 11,
    title: "주석",
    content: `
### 주석
- HTML 주석 사용: \`<!-- 주석 내용 -->\``,
  },
  {
    id: 12,
    title: "확장 문법",
    content: `
### 확장 문법
- HTML 포함: \<div style="color: blue;">HTML을 사용할 수 있습니다.</div>\`
- 수학식 포함: \$E = mc^2$\
`,
  },
];

const MarkdownGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Markdown 사용법</h1>

      {/* 버튼 그룹 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {markdownSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded ${
              activeSection === section.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-blue-300`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* 선택된 내용 표시 */}
      <div className="content">
        {activeSection ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {markdownSections.find((section) => section.id === activeSection)?.title}
            </h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
              {markdownSections.find((section) => section.id === activeSection)?.content}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">버튼을 눌러 내용을 확인하세요.</p>
        )}
      </div>
    </div>
  );
};

export default MarkdownGuide;
