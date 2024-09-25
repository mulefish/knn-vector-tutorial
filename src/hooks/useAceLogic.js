// src/hooks/useAceLogic.js
import { useState } from 'react';

const useAceLogic = () => {
  const [aceValues, setAceValues] = useState({}); // Store ace values

  // Determine the correct value for an Ace
  const determineAceValue = (currentAverage) => {
    const diffAs1 = Math.abs(1 - currentAverage);
    const diffAs14 = Math.abs(14 - currentAverage);
    return diffAs1 <= diffAs14 ? 1 : 14;
  };

  // Store ace values as they're decided
  const setAceValue = (cardDisplay, value) => {
    setAceValues((prev) => ({ ...prev, [cardDisplay]: value }));
  };

  return { aceValues, determineAceValue, setAceValue };
};

export default useAceLogic;
