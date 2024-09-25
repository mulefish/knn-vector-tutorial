
import React, { useState, useEffect } from 'react';
import './styles.css';
import useCards from './hooks/useCards';
import useShuffle from './hooks/useShuffle';
import useAceLogic from './hooks/useAceLogic';
import { ChakraProvider, Box, Heading, VStack, Text, Button, Select } from '@chakra-ui/react';

const App = () => {
  const { deck } = useCards(); // Retrieve deck from custom hook
  const { shuffleDeck } = useShuffle(); // Import shuffle logic
  const { aceValues, determineAceValue, setAceValue } = useAceLogic(); // Import Ace logic
  
  const [buckets, setBuckets] = useState([]);
  const [averages, setAverages] = useState([]);
  const [remainingDeck, setRemainingDeck] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(null);

  useEffect(() => {
    if (selectedColumns) {
      resetBuckets(selectedColumns);
    }
  }, [selectedColumns]);

  const resetBuckets = (n) => {
    const shuffledDeck = shuffleDeck(deck); // Shuffle the deck using the hook
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
          const aceValue = determineAceValue(currentAverage); // Determine the value using the hook
          card.value = aceValue;
          setAceValue(card.display, aceValue); // Store the determined value
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
  };

  return (
    <ChakraProvider>
      <div className="container">
        <Heading mb={6}>Playing Cards Display</Heading>
        
        <Select id="columnDropdown" placeholder="Select number of columns" width="200px" mb={4}>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </Select>
        
        <Button colorScheme="green" mb={4} onClick={handleConfirm}>
          Make buckets
        </Button>
        
        <Button colorScheme="blue" mb={4} onClick={addNextRow} disabled={selectedColumns === null}>
          Add Next Row
        </Button>

        <div className="card-grid">
          {buckets.map((bucket, index) => (
            <div key={index} className="card-column">
              <div className="card-column-heading">Bucket {index + 1}</div>
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
      </div>
    </ChakraProvider>
  );
};

export default App;
