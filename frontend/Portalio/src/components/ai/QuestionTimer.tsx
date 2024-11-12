import React, { useEffect, useState, useRef } from "react";
import { QuestionTimerProps } from "../../type/InterviewType";

const QuestionTimer: React.FC<QuestionTimerProps> = ({
  isPreparationTime,
  preparationTime,
  answerTime,
  onPreparationEnd,
  onAnswerEnd,
}) => {
  const [time, setTime] = useState(isPreparationTime ? preparationTime : answerTime);
  const timerId = useRef<number | null>(null); // 타이머 ID를 useRef로 관리하여 중복 실행 방지
  const [isTimerActive, setIsTimerActive] = useState(false);

  // 준비 시간 또는 답변 시간 변경 시 타이머 초기화
  useEffect(() => {
    setTime(isPreparationTime ? preparationTime : answerTime);
    setIsTimerActive(true); // 타이머 활성화
    console.log("타이머 시작:", isPreparationTime ? "준비 시간" : "답변 시간", "초기 시간:", isPreparationTime ? preparationTime : answerTime);

    // 컴포넌트 언마운트 시 타이머 비활성화 및 정리
    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
      setIsTimerActive(false); // 타이머 비활성화
    };
  }, [isPreparationTime, preparationTime, answerTime]);

  // 타이머 실행 및 종료 처리
  useEffect(() => {
    if (!isTimerActive) return;
  
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          
          // 상태 업데이트를 다음 렌더링 사이클로 지연
          setTimeout(() => {
            if (isPreparationTime) {
              onPreparationEnd();
            } else {
              onAnswerEnd();
            }
          }, 0);
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [isTimerActive, isPreparationTime, onPreparationEnd, onAnswerEnd]);
  
  return (
    <div>
      <p>
        {isPreparationTime ? "준비 시간" : "답변 시간"}: {time}초
      </p>
    </div>
  );
};

export default QuestionTimer;
