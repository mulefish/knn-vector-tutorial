// src/components/RunHistoryChart.jsx

/* 
ERROR
 could not find react-redux context value; please ensure the component is wrapped in a <Provider>
 */ 

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const RunHistoryChart = () => {
  const canvasRef = useRef(null);
  const runHistory = useSelector((state) => state.runHistory.history);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Determine the scaling factors
    const padding = 20;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;
    const maxVectorValue = 1; // since vectors are normalized between 0 and 1
    const stepX = width / (runHistory[0]?.length - 1 || 1);
    
    // Function to draw a single vector line
    const drawLine = (vector, color) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      vector.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = padding + height - (value / maxVectorValue) * height; // Invert the y-axis

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    };

    // Draw all previous vectors in gray
    runHistory.slice(0, -1).forEach((vector) => {
      drawLine(vector, 'gray');
    });

    // Draw the latest vector in orange if there is one
    if (runHistory.length > 0) {
      drawLine(runHistory[runHistory.length - 1], 'blue');
    }
  }, [runHistory]);

  return (
    <canvas ref={canvasRef} width="300" height="200" style={{ border: '1px solid #ccc', marginTop: '20px' }} />
  );
};

export default RunHistoryChart;
