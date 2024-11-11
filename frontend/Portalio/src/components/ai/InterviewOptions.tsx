import React from "react";

interface InterviewOptionsProps {
  onOptionSelect: (type: "video" | "audio" | "text") => void;
}

const InterviewOptions: React.FC<InterviewOptionsProps> = ({ onOptionSelect }) => {
  return (
    <div>
      <button onClick={() => onOptionSelect("video")}>화상 면접</button>
      <button onClick={() => onOptionSelect("audio")}>음성 면접</button>
      <button onClick={() => onOptionSelect("text")}>텍스트 면접</button>
    </div>
  );
};

export default InterviewOptions;
