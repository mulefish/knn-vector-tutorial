import { useState } from 'react';

// Custom hook to manage card data
const useCards = () => {

    const raw = [
        { value: 14, display: "A♥" }, { value: 2, display: "2♥" }, { value: 3, display: "3♥" }, { value: 4, display: "4♥" },
        { value: 5, display: "5♥" }, { value: 6, display: "6♥" }, { value: 7, display: "7♥" }, { value: 8, display: "8♥" },
        { value: 9, display: "9♥" }, { value: 10, display: "10♥" }, { value: 11, display: "J♥" }, { value: 12, display: "Q♥" },
        { value: 13, display: "K♥" }, { value: 14, display: "A♦" }, { value: 2, display: "2♦" }, { value: 3, display: "3♦" },
        { value: 4, display: "4♦" }, { value: 5, display: "5♦" }, { value: 6, display: "6♦" }, { value: 7, display: "7♦" },
        { value: 8, display: "8♦" }, { value: 9, display: "9♦" }, { value: 10, display: "10♦" }, { value: 11, display: "J♦" },
        { value: 12, display: "Q♦" }, { value: 13, display: "K♦" }, { value: 14, display: "A♠" }, { value: 2, display: "2♠" },
        { value: 3, display: "3♠" }, { value: 4, display: "4♠" }, { value: 5, display: "5♠" }, { value: 6, display: "6♠" },
        { value: 7, display: "7♠" }, { value: 8, display: "8♠" }, { value: 9, display: "9♠" }, { value: 10, display: "10♠" },
        { value: 11, display: "J♠" }, { value: 12, display: "Q♠" }, { value: 13, display: "K♠" }, { value: 14, display: "A♣" },
        { value: 2, display: "2♣" }, { value: 3, display: "3♣" }, { value: 4, display: "4♣" }, { value: 5, display: "5♣" },
        { value: 6, display: "6♣" }, { value: 7, display: "7♣" }, { value: 8, display: "8♣" }, { value: 9, display: "9♣" },
        { value: 10, display: "10♣" }, { value: 11, display: "J♣" }, { value: 12, display: "Q♣" }, { value: 13, display: "K♣" }
    ];
    // Initialize state for cards
    const [deck, setDeck] = useState([...raw]);

    // Function to shuffle cards or reset deck if needed in future
    const resetDeck = () => setDeck([...raw]);

    return { deck, resetDeck };
};

export default useCards;
