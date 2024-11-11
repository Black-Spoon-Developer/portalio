import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const AnalysisResultPage: React.FC = () => {
  const { analysisResults } = useSelector((state: RootState) => state.interview);

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">분석 결과</h1>
        <div>
          {Object.entries(analysisResults).map(([questionIndex, result], idx) => (
            <div key={idx} className="mb-4">
              <h2 className="font-semibold">질문 {Number(questionIndex) + 1}</h2>
              <p>{JSON.stringify(result)}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AnalysisResultPage;
