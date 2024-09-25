// src/hooks/useShuffle.js
const useShuffle = () => {
    // Function to shuffle the deck using the Fisher-Yates algorithm
    const shuffleDeck = (deck) => {
      const shuffledDeck = [...deck];
      for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
      }
      return shuffledDeck;
    };
  
    return { shuffleDeck };
  };
  
  export default useShuffle;
  