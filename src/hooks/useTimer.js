import { useState, useEffect } from 'react';
import { TIMER_DURATION } from '../constants';

export const useTimer = () => {
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            alert('Tempo esgotado!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startMatchTimer = (matchId, isFinal = false) => {
    setActiveMatch(matchId);
    const minutes = isFinal ? TIMER_DURATION.FINAL_MATCH : TIMER_DURATION.NORMAL_MATCH;
    setTimer(minutes);
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    setIsTimerRunning(true);
  };

  const resetTimer = (isFinal = false) => {
    const minutes = isFinal ? TIMER_DURATION.FINAL_MATCH : TIMER_DURATION.NORMAL_MATCH;
    setTimer(minutes);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timer,
    isTimerRunning,
    activeMatch,
    setActiveMatch,
    startMatchTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formatTime
  };
};