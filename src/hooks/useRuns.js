// src/hooks/useRuns.js
import { useState } from 'react';

const useRuns = () => {
  const [runHistory, setRunHistory] = useState([]);

  const recordRun = (averages, normalizeAverages) => {
    if (averages.length > 0) {
      const normalizedVector = normalizeAverages(averages);
      setRunHistory(prevHistory => [...prevHistory, normalizedVector]);
    }
  };

  const resetRunHistory = () => {
    setRunHistory([]);
  };

  return { runHistory, recordRun, resetRunHistory };
};

export default useRuns;
