import React, { useState, useEffect } from 'react';
import './styles.css';
import useCards from './hooks/useCards';
import useShuffle from './hooks/useShuffle';
import useAceLogic from './hooks/useAceLogic';
import { ChakraProvider, Box, Heading, VStack, Text, Button, Select, HStack, Flex } from '@chakra-ui/react';
import Header from './Header.jsx';

const App = () => {
  const { deck } = useCards();
  const { shuffleDeck } = useShuffle();
  const { aceValues, determineAceValue, setAceValue } = useAceLogic();
  
  const [buckets, setBuckets] = useState([]);
  const [averages, setAverages] = useState([]);
  const [remainingDeck, setRemainingDeck] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(3); // Set default columns to 3


  const [normalizedVector, setNormalizedVector] = useState([]);

// Update useEffect to calculate the normalized vector whenever the averages change
useEffect(() => {
    if (averages.length > 0) {
        const normalized = averages.map(avg => ((avg - 1) / (14 - 1)).toFixed(3));
        setNormalizedVector(normalized);
    }
}, [averages]);


  // Initialize the buckets and UI immediately on component mount
  useEffect(() => {
    resetBuckets(selectedColumns);
  }, []); 

  useEffect(() => {
    if (selectedColumns) {
      resetBuckets(selectedColumns);
    }
  }, [selectedColumns]);

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
    <Heading mb={6} fontSize="lg">KNN with a deck of cards</Heading>
    
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

    {/* Use Flex to align the card grid and vector display */}
    <Flex align="flex-start">
      {/* Display normalized vector to the left of the columns */}
      <Box mr={4} p={3} border="1px" borderColor="gray.300" borderRadius="md" boxShadow="md">
        <Text fontWeight="bold" mb={2}>Normalized Vector:</Text>
        <Text fontSize="sm">[{normalizedVector.join(', ')}]</Text>
      </Box>

      <div className="card-grid" style={{ flex: 1 }}>
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
      </div>
    </Flex>
  </Box>
</ChakraProvider>



  );
};

export default App;
