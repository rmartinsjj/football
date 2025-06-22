import { useState, useEffect } from 'react';

// Timer finished callback will be handled by the component using this hook
export const useTimer = (settings = null) => {
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);
  const [onTimerFinished, setOnTimerFinished] = useState(null);
  
  // Default timer durations (can be overridden by settings)
  const getTimerDuration = (isFinal = false) => {
    if (settings) {
      return isFinal 
        ? settings.finalMatchTime * 60 
        : settings.normalMatchTime * 60;
    }
    // Fallback to default values
    return isFinal ? 10 * 60 : 7 * 60;
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Call the callback instead of showing alert
            if (onTimerFinished) {
              onTimerFinished();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, onTimerFinished]);

  const startMatchTimer = (matchId, isFinal = false) => {
    setActiveMatch(matchId);
    const duration = getTimerDuration(isFinal);
    setTimer(duration);
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    setIsTimerRunning(true);
  };

  const resetTimer = (isFinal = false) => {
    const duration = getTimerDuration(isFinal);
    setTimer(duration);
    setIsTimerRunning(false);
  };

  const setTimerForMatch = (matchId, isFinal = false) => {
    setActiveMatch(matchId);
    const duration = getTimerDuration(isFinal);
    setTimer(duration);
    setIsTimerRunning(false); // Don't auto-start, just set the time
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
    setOnTimerFinished,
    startMatchTimer,
    setTimerForMatch,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formatTime
  };
};