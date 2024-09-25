import { renderHook, act } from '@testing-library/react'; // Using renderHook with react-testing-library for testing hooks
import useRuns from '../useRuns';

describe('useRuns Hook', () => {
  test('should initialize run history correctly', () => {
    const { result } = renderHook(() => useRuns());
    
    // Check initial runHistory state
    expect(result.current.runHistory).toEqual([]);
  });

  test('should add a normalized vector to the run history', () => {
    const { result } = renderHook(() => useRuns());

    const sampleAverages = [5, 7, 10];
    
    act(() => {
      result.current.addRun(sampleAverages);
    });

    expect(result.current.runHistory.length).toBe(1);
    expect(result.current.runHistory[0]).toEqual([
      ((5 - 1) / (14 - 1)).toFixed(3),
      ((7 - 1) / (14 - 1)).toFixed(3),
      ((10 - 1) / (14 - 1)).toFixed(3),
    ]);
  });

  test('should clear the run history', () => {
    const { result } = renderHook(() => useRuns());

    const sampleAverages = [5, 7, 10];

    act(() => {
      result.current.addRun(sampleAverages);
    });

    expect(result.current.runHistory.length).toBe(1);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.runHistory).toEqual([]);
  });
});
