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

  const resetBuckets = (n) => {
    const shuffledDeck = shuffleDeck(deck);
    const newBuckets = Array.from({ length: n }, () => []);
    setBuckets(newBuckets);
    setRemainingDeck([...shuffledDeck]);
    setAverages(new Array(n).fill(0));
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
    let bucketIndex = 0;

    for (let i = 0; i < updatedBuckets.length; i++) {
      if (remainingDeck.length > 0) {
        const card = remainingDeck.shift();
        
        if (card.display.startsWith("A") && aceValues[card.display] === undefined && updatedBuckets[bucketIndex].length > 0) {
          const currentAverage = averages[bucketIndex];
          const aceValue = determineAceValue(currentAverage);
          card.value = aceValue;
          setAceValue(card.display, aceValue);
        }

        updatedBuckets[bucketIndex].push(card);
        bucketIndex = (bucketIndex + 1) % updatedBuckets.length;
      }
    }

    setBuckets(updatedBuckets);

    const updatedAverages = updatedBuckets.map(bucket => calculateAverage(bucket));
    setAverages(updatedAverages);
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
        </div>
      </Box>
    </ChakraProvider>
  );
};

export default App;
