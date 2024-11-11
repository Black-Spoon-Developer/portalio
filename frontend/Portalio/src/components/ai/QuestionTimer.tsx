// src/components/QuestionTimer.tsx
import React, { useState, useEffect } from 'react';
import { QuestionTimerProps } from '../../type/InterviewType';

const QuestionTimer: React.FC<QuestionTimerProps> = ({ time, onTimeEnd, label }) => {
  const [remainingTime, setRemainingTime] = useState<number>(time);

  useEffect(() => {
    setRemainingTime(time);
  }, [time]);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      console.log(`${label} has ended.`);
      onTimeEnd();
    }
  }, [remainingTime, onTimeEnd]);

  return (
    <div>
      <p>{label}: {remainingTime}초</p>
    </div>
  );
};

export default QuestionTimer;
