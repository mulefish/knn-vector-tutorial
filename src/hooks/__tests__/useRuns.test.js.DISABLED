// src/hooks/__tests__/useRuns.test.js
import { renderHook, act } from '@testing-library/react'; // Using renderHook with react-testing-library for testing hooks

import useRuns from '../useRuns';

describe('useRuns hook', () => {
  it('should initialize with an empty run history', () => {
    const { result } = renderHook(() => useRuns());
    expect(result.current.runHistory).toEqual([]);
  });

  it('should record a run with normalized averages', () => {
    const { result } = renderHook(() => useRuns());
    
    const sampleAverages = [2, 7, 13];
    const normalizeAverages = (averages) => {
      const minValue = 1;
      const maxValue = 14;
      return averages.map(avg => ((avg - minValue) / (maxValue - minValue)).toFixed(3));
    };

    act(() => {
      result.current.recordRun(sampleAverages, normalizeAverages);
    });

    expect(result.current.runHistory).toEqual([['0.077', '0.462', '0.923']]);
  });

  it('should not record a run when averages array is empty', () => {
    const { result } = renderHook(() => useRuns());

    act(() => {
      result.current.recordRun([], () => []); // Call with an empty averages array
    });

    expect(result.current.runHistory).toEqual([]);
  });

  it('should reset the run history', () => {
    const { result } = renderHook(() => useRuns());

    // Record a run
    act(() => {
      result.current.recordRun([1, 7, 14], (averages) => averages);
    });

    expect(result.current.runHistory.length).toBe(1);

    // Reset the run history
    act(() => {
      result.current.resetRunHistory();
    });

    expect(result.current.runHistory).toEqual([]);
  });
});
