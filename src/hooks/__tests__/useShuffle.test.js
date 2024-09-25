import { renderHook, act } from '@testing-library/react'; // Using renderHook with react-testing-library for testing hooks

import useShuffle from '../useShuffle';

describe('useShuffle Hook', () => {
  test('should return a shuffled deck that is different from the original', () => {
    const { result } = renderHook(() => useShuffle());
    const { shuffleDeck } = result.current;

    const originalDeck = [
      { value: 1, display: 'A♥' },
      { value: 2, display: '2♥' },
      { value: 3, display: '3♥' },
      { value: 4, display: '4♥' },
      { value: 5, display: '5♥' },
      { value: 6, display: '6♥' },
      { value: 7, display: '7♥' },
      { value: 8, display: '8♥' },
      { value: 9, display: '9♥' },
      { value: 10, display: '10♥' },
    ];

    const shuffledDeck = shuffleDeck(originalDeck);

    // Ensure the shuffled deck is still the same length
    expect(shuffledDeck).toHaveLength(originalDeck.length);

    // Ensure that the shuffled deck has the same cards as the original
    expect(shuffledDeck).toEqual(expect.arrayContaining(originalDeck));

    // Ensure that the shuffled deck is in a different order
    expect(shuffledDeck).not.toEqual(originalDeck);
  });
});
