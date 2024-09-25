import { renderHook, act } from '@testing-library/react'; // Using renderHook with react-testing-library for testing hooks
import useAceLogic from '../useAceLogic';

describe('useAceLogic Hook', () => {
  test('should initialize with an empty aceValues object', () => {
    // Render the hook
    const { result } = renderHook(() => useAceLogic());

    // Ensure that aceValues is initially an empty object
    expect(result.current.aceValues).toEqual({});
  });

  test('should correctly determine the closest value for an Ace (1 or 14)', () => {
    const { result } = renderHook(() => useAceLogic());
    const { determineAceValue } = result.current;

    // Test when the average is closer to 1
    expect(determineAceValue(3)).toBe(1);

    // Test when the average is closer to 14
    expect(determineAceValue(10)).toBe(14);
  });

  test('should correctly set ace value in aceValues', () => {
    const { result } = renderHook(() => useAceLogic());
    const { setAceValue } = result.current;

    // Act to set an Ace value
    act(() => {
      setAceValue('A♥', 14);
    });

    // Validate that the ace value was set correctly
    expect(result.current.aceValues['A♥']).toBe(14);
  });
});
