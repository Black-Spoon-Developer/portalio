import React from "react";
import AudioAnalysisContent from "../../../../components/ai/analysis/audio/AudioAnalysisContent";
import AiAnalysisTab from "../../../../components/ai/analysis/AiAnalysisTab";

const AudioAnalysisPage: React.FC = () => {
  // 
  
  return (
    <div className="grid grid-cols-6">
      <section className="col-span-1"></section>
      <section className="col-span-4">
        {/* <AiAnalysisTab /> */}
        <AudioAnalysisContent />
      </section>
      <section className="col-span-1"></section>
    </div>
  );
};

export default AudioAnalysisPage;
