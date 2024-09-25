import { renderHook, act } from '@testing-library/react'; // Using renderHook with react-testing-library for testing hooks

import useCards from '../useCards';

describe('useCards Hook', () => {
  test('should initialize with a full deck', () => {
    const { result } = renderHook(() => useCards());
    expect(result.current.deck.length).toBeGreaterThan(0);
  });

  test('resetDeck should reset the deck to full', () => {
    const { result } = renderHook(() => useCards());

    // Simulate removing a card
    act(() => {
      result.current.deck.pop();
    });
    expect(result.current.deck.length).toBeLessThan(52);

    // Now reset the deck
    act(() => {
      result.current.resetDeck();
    });

    expect(result.current.deck.length).toBe(52); // Assuming 52 cards in a full deck
  });
});
