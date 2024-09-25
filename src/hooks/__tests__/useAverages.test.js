import { renderHook, act } from '@testing-library/react-hooks';
import useAverages from '../useAverages';

describe('useAverages hook', () => {
  it('should initialize with an empty averages array', () => {
    const { result } = renderHook(() => useAverages());
    expect(result.current.averages).toEqual([]);
  });

  it('should calculate the correct average for a given bucket', () => {
    const { result } = renderHook(() => useAverages());
    const aceValues = { "A♥": 1 };
    const bucket = [{ value: 10, display: "10♥" }, { value: undefined, display: "A♥" }];

    const average = result.current.calculateAverage(bucket, aceValues);
    expect(average).toEqual('5.50'); // (10 + 1) / 2 = 5.5
  });

  it('should return normalized averages', () => {
    const { result } = renderHook(() => useAverages());
    
    // Manually set averages
    act(() => {
      result.current.setAverages([1, 7.5, 14]);
    });

    const normalized = result.current.normalizeAverages(result.current.averages);
    expect(normalized).toEqual(['0.000', '0.500', '1.000']); // Normalized values
  });

  it('should handle Ace correctly when aceValues are provided', () => {
    const { result } = renderHook(() => useAverages());
    const aceValues = { "A♠": 14 };
    const bucket = [{ value: 5, display: "5♠" }, { value: undefined, display: "A♠" }];

    const average = result.current.calculateAverage(bucket, aceValues);
    expect(average).toEqual('9.50'); // (5 + 14) / 2 = 9.5
  });
});
