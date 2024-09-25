import React, { useState, useEffect } from 'react';
import './styles.css';
import useCards from './hooks/useCards';
import useShuffle from './hooks/useShuffle';
import useAceLogic from './hooks/useAceLogic';
import { ChakraProvider, Box, Heading, VStack, Text, Button, Select, HStack } from '@chakra-ui/react';
import Header from './Header.jsx';

const App = () => {
  const { deck } = useCards();
  const { shuffleDeck } = useShuffle();
  const { aceValues, determineAceValue, setAceValue } = useAceLogic();
  
  const [buckets, setBuckets] = useState([]);
  const [averages, setAverages] = useState([]);
  const [remainingDeck, setRemainingDeck] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(3); // Set default columns to 3

  // Initialize the buckets and UI immediately on component mount
  useEffect(() => {
    resetBuckets(selectedColumns);
  }, []); 

  useEffect(() => {
    if (selectedColumns) {
      resetBuckets(selectedColumns);
    }
  }, [selectedColumns]);
/* 
  const resetBuckets = (n) => {
    const shuffledDeck = shuffleDeck(deck);
    const newBuckets = Array.from({ length: n }, () => []);
    setBuckets(newBuckets);
    setRemainingDeck([...shuffledDeck]);
    setAverages(new Array(n).fill(0));
  };
*/
const resetBuckets = (n) => {
  const shuffledDeck = shuffleDeck(deck);
  const newBuckets = Array.from({ length: n }, () => []);
  const selectedValues = new Set(); // A set to track selected card values

  // Assign one unique random card to each bucket
  for (let i = 0; i < n; i++) {
      let card;
      
      // Keep drawing a card until we find one with a unique value
      do {
          if (shuffledDeck.length === 0) {
              alert('Ran out of cards while trying to ensure unique values.');
              break;
          }
          card = shuffledDeck.shift();
      } while (selectedValues.has(card.value));

      // Add the card to the bucket and store its value in the set
      if (card) {
          newBuckets[i].push(card);
          selectedValues.add(card.value);
      }
  }

  setBuckets(newBuckets);
  setRemainingDeck([...shuffledDeck]);
  
  // Calculate the initial averages based on the single card in each bucket
  const initialAverages = newBuckets.map(bucket => calculateAverage(bucket));
  setAverages(initialAverages);
};


  const calculateAverage = (bucket) => {
    const totalValue = bucket.reduce((sum, card) => {
      let cardValue = card.value;
      if (card.display.startsWith("A")) {
        cardValue = aceValues[card.display] !== undefined ? aceValues[card.display] : 1;
      }
      return sum + cardValue;
    }, 0);

    return bucket.length > 0 ? (totalValue / bucket.length).toFixed(2) : 0;
  };

  // const addNextRow = () => {
  //   if (remainingDeck.length === 0) {
  //     alert('No more cards to deal!');
  //     return;
  //   }

  //   const updatedBuckets = [...buckets];
  //   let bucketIndex = 0;

  //   for (let i = 0; i < updatedBuckets.length; i++) {
  //     if (remainingDeck.length > 0) {
  //       const card = remainingDeck.shift();
        
  //       if (card.display.startsWith("A") && aceValues[card.display] === undefined && updatedBuckets[bucketIndex].length > 0) {
  //         const currentAverage = averages[bucketIndex];
  //         const aceValue = determineAceValue(currentAverage);
  //         card.value = aceValue;
  //         setAceValue(card.display, aceValue);
  //       }

  //       updatedBuckets[bucketIndex].push(card);
  //       bucketIndex = (bucketIndex + 1) % updatedBuckets.length;
  //     }
  //   }

  //   setBuckets(updatedBuckets);

  //   const updatedAverages = updatedBuckets.map(bucket => calculateAverage(bucket));
  //   setAverages(updatedAverages);
  // };
//   const addNextRow = () => {
//     if (remainingDeck.length === 0) {
//         alert('No more cards to deal!');
//         return;
//     }

//     const updatedBuckets = [...buckets];

//     // Process each card from the remaining deck
//     while (remainingDeck.length > 0) {
//         const card = remainingDeck.shift();
        
//         // Determine the card's value, especially for Ace
//         let cardValue = card.value;
//         if (card.display.startsWith("A")) {
//             cardValue = aceValues[card.display] !== undefined ? aceValues[card.display] : 1;
//         }

//         // Find the bucket (column) whose average is closest to the card's value
//         let closestBucketIndex = 0;
//         let minDifference = Math.abs(averages[0] - cardValue);

//         for (let i = 1; i < updatedBuckets.length; i++) {
//             const difference = Math.abs(averages[i] - cardValue);
//             if (difference < minDifference) {
//                 closestBucketIndex = i;
//                 minDifference = difference;
//             }
//         }

//         // Push the card to the bucket with the closest average
//         updatedBuckets[closestBucketIndex].push(card);

//         // Recalculate the average for the affected bucket
//         const newAverage = calculateAverage(updatedBuckets[closestBucketIndex]);
//         const updatedAverages = [...averages];
//         updatedAverages[closestBucketIndex] = newAverage;
//         setAverages(updatedAverages);

//         // If this card was an Ace, store its decided value
//         if (card.display.startsWith("A") && aceValues[card.display] === undefined) {
//             setAceValue(card.display, cardValue);
//         }
//     }

//     setBuckets(updatedBuckets);
// };

const addNextRow = () => {
  if (remainingDeck.length === 0) {
      alert('No more cards to deal!');
      return;
  }

  const updatedBuckets = [...buckets];
  let cardsToDraw = selectedColumns; // Number of cards to draw based on the dropdown selection

  while (cardsToDraw > 0 && remainingDeck.length > 0) {
      const card = remainingDeck.shift();

      // Determine the card's value, especially for Ace
      let cardValue = card.value;
      if (card.display.startsWith("A")) {
          cardValue = aceValues[card.display] !== undefined ? aceValues[card.display] : 1;
      }

      // Find the bucket (column) whose average is closest to the card's value
      let closestBucketIndex = 0;
      let minDifference = Math.abs(averages[0] - cardValue);

      for (let i = 1; i < updatedBuckets.length; i++) {
          const difference = Math.abs(averages[i] - cardValue);
          if (difference < minDifference) {
              closestBucketIndex = i;
              minDifference = difference;
          }
      }

      // Add the card to the selected bucket
      updatedBuckets[closestBucketIndex].push(card);

      // Recalculate the average for the affected bucket
      const newAverage = calculateAverage(updatedBuckets[closestBucketIndex]);
      const updatedAverages = [...averages];
      updatedAverages[closestBucketIndex] = newAverage;
      setAverages(updatedAverages);

      // If this card was an Ace, store its decided value
      if (card.display.startsWith("A") && aceValues[card.display] === undefined) {
          setAceValue(card.display, cardValue);
      }

      cardsToDraw--; // Decrement the number of cards left to draw
  }

  setBuckets(updatedBuckets);
};


  const handleConfirm = () => {
    const dropdown = document.getElementById("columnDropdown");
    const selectedValue = dropdown.value;
    setSelectedColumns(parseInt(selectedValue, 10));
    resetBuckets(parseInt(selectedValue, 10)); // Reset and redraw the UI
  };

  return (
    <ChakraProvider>
      <Header />
      <Box p={5}>
        <Heading mb={6}>Playing Cards Display</Heading>
        
        {/* Use HStack to place elements on the same row */}
        <HStack spacing={4} mb={6} align="center">
          <Select 
            id="columnDropdown" 
            defaultValue="3" // Set default value to "3"
            width="200px"
          >
            <option value="3">3 dimensions</option>
            <option value="4">4 dimensions</option>
            <option value="5">5 dimensions</option>
            <option value="6">6 dimensions</option>
          </Select>
          
          <Button colorScheme="green" onClick={handleConfirm}>
            Change number of dimensions
          </Button>
          
          <Button colorScheme="blue" onClick={addNextRow} disabled={selectedColumns === null}>
            Add more observations
          </Button>
        </HStack>
{/* 
        <div className="card-grid">
          {buckets.map((bucket, index) => (
            <div key={index} className="card-column">
              <Text mb={2}>Average: {averages[index]}</Text>
              {bucket.map((card, idx) => (
                <div 
                  key={idx}
                  className={`card ${card.display.includes("♥") || card.display.includes("♦") ? 'red' : 'black'}`}
                >
                  <div className="card-value">{card.display}</div>
                </div>
              ))}
            </div>
          ))}
        </div> */}


<div className="card-grid">
  {buckets.map((bucket, index) => (
    <div key={index} className="card-column">
      <Text mb={2}>Average: {averages[index]}</Text>
      {bucket.map((card, idx) => {
        // Determine the display for Ace cards with their suit
        let cardDisplay = card.display;
        if (card.display.startsWith("A")) {
          const suitSymbol = card.display.slice(1); // Extract the suit symbol (e.g., "♥", "♠", etc.)
          if (aceValues[card.display] !== undefined) {
            cardDisplay = `A  ${suitSymbol} ${aceValues[card.display]}`; // Show Ace with its assigned value and suit
          } else {
            cardDisplay = `A ${suitSymbol} ?`; // Show Ace as TBD with its suit if not yet determined
          }
        }

        return (
          <div
            key={idx}
            className={`card ${card.display.includes("♥") || card.display.includes("♦") ? 'red' : 'black'}`}
          >
            <div className="card-value">{cardDisplay}</div>
          </div>
        );
      })}
    </div>
  ))}
</div>

      </Box>
    </ChakraProvider>
  );
};

export default App;
