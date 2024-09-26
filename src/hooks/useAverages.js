import { useState } from 'react';

const useAverages = () => {
  const [averages, setAverages] = useState([]);

  const calculateAverage = (bucket, aceValues) => {
    const totalValue = bucket.reduce((sum, card) => {
      let cardValue = card.value;
      if (card.display.startsWith("A")) {
        cardValue = aceValues[card.display] !== undefined ? aceValues[card.display] : 1;
      }
      return sum + cardValue;
    }, 0);

    return bucket.length > 0 ? (totalValue / bucket.length).toFixed(2) : 0;
  };

  // const normalizeAverages = (averages) => {
  //   const minValue = 1;
  //   const maxValue = 14;
  //   return averages.map(avg => ((avg - minValue) / (maxValue - minValue)).toFixed(3));
  // };

  // const normalizeAverages = (averages = []) => {
  //   const minValue = 1;
  //   const maxValue = 14;
  //   return averages.map(avg => ((avg - minValue) / (maxValue - minValue)).toFixed(3));
  // };


  const normalizeAverages = (averages = []) => {
    if (!Array.isArray(averages) || averages.length === 0) {
      console.warn("normalizeAverages received an invalid or empty array:", averages);
      return [];
    }
  
    const minValue = 1;
    const maxValue = 14;
    return averages.map(avg => ((avg - minValue) / (maxValue - minValue)).toFixed(3));
  };
  

  return { averages, setAverages, calculateAverage, normalizeAverages };
};

export default useAverages;
