import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./PortfolioDetailMd.css";

interface PortfolioDetailPdfProps {
  portfolioContent: string;
}

interface Section {
  title: string;
  content: string;
  level: number;
  children?: Section[];
}

const parseMarkdownSections = (content: string): Section[] => {
  const lines = content.split("\n");
  const sections: Section[] = [];
  const stack: Section[] = [];

  lines.forEach((line) => {
    const level = line.match(/^(#{1,3}) /)?.[1].length || 0;
    const title = line.replace(/^#+ /, "");

    if (level >= 1 && level <= 3) {
      const section: Section = { title, content: "", level, children: [] };

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        sections.push(section); // 최상위 섹션으로 추가
      } else {
        const parent = stack[stack.length - 1];
        parent.children = parent.children || [];
        parent.children.push(section);
      }

      stack.push(section);
    } else if (stack.length > 0) {
      stack[stack.length - 1].content += line + "\n";
    }
  });

  return sections;
};

const PortfolioDetailPdf: React.FC<PortfolioDetailPdfProps> = ({
  portfolioContent,
}) => {
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set()
  );
  const [selectedContent, setSelectedContent] = useState<string>("");
  const pdfRef = useRef<HTMLDivElement>(null);

  const sections = parseMarkdownSections(portfolioContent);

  const toggleSection = (title: string) => {
    setSelectedSections((prev) => {
      const newSelections = new Set(prev);
      if (newSelections.has(title)) newSelections.delete(title);
      else newSelections.add(title);
      return newSelections;
    });
  };

  const gatherContent = (sections: Section[]): string => {
    return sections
      .filter((section) => selectedSections.has(section.title))
      .map(
        (section) =>
          `${"#".repeat(section.level)} ${section.title}\n${
            section.content
          }${gatherContent(section.children || [])}`
      )
      .join("\n");
  };

  const handleDownloadPDF = () => {
    const content = gatherContent(sections);
    setSelectedContent(content);

    if (pdfRef.current) {
      pdfRef.current.style.display = "block";
      html2pdf()
        .from(pdfRef.current)
        .set({
          filename: "PortfolioDetail.pdf",
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .save()
        .finally(() => {
          pdfRef.current!.style.display = "none";
        });
    }
  };

  return (
    <div className="my-5 mx-6 p-4 border-2 rounded-lg">
      <h3 className="mb-4 font-bold">PDF로 포함할 섹션 선택</h3>
      <ul>
        {sections.map((section) => (
          <li key={section.title} className="mb-2">
            <input
              type="checkbox"
              checked={selectedSections.has(section.title)}
              onChange={() => toggleSection(section.title)}
              className="mr-2"
            />
            <span>{section.title}</span>
            {section.children?.map((subSection) => (
              <div className="ml-4" key={subSection.title}>
                <input
                  type="checkbox"
                  checked={selectedSections.has(subSection.title)}
                  onChange={() => toggleSection(subSection.title)}
                  className="mr-2"
                />
                <span>{subSection.title}</span>
                {subSection.children?.map((subSubSection) => (
                  <div className="ml-4" key={subSubSection.title}>
                    <input
                      type="checkbox"
                      checked={selectedSections.has(subSubSection.title)}
                      onChange={() => toggleSection(subSubSection.title)}
                      className="mr-2"
                    />
                    <span>{subSubSection.title}</span>
                  </div>
                ))}
              </div>
            ))}
          </li>
        ))}
      </ul>
      <button
        onClick={handleDownloadPDF}
        className="bg-conceptSkyBlue text-white px-4 py-2 mt-4 rounded"
      >
        pdf로 다운로드
      </button>

      {/* PDF 변환용 숨겨진 HTML 요소 */}
      <div ref={pdfRef} className="markdown-viewer hidden">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {selectedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default PortfolioDetailPdf;
