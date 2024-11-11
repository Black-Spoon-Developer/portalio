// src/components/QuestionTimer.tsx
import React, { useState, useEffect } from 'react';
import { QuestionTimerProps } from '../../type/InterviewType';

const QuestionTimer: React.FC<QuestionTimerProps> = ({ time, onTimeEnd, label }) => {
  const [remainingTime, setRemainingTime] = useState<number>(time);

  // `time`이 변경될 때마다 남은 시간을 초기화
  useEffect(() => {
    setRemainingTime(time);
  }, [time]);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (remainingTime === 0) {
      console.log(`${label} has ended.`);
      onTimeEnd();
    }
  }, [remainingTime, onTimeEnd, label]);

  return (
    <div>
      <p>{label}: {remainingTime}초</p>
    </div>
  );
};

export default QuestionTimer;
