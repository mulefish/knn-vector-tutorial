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
  const [selectedColumns, setSelectedColumns] = useState(6);
  const [runHistory, setRunHistory] = useState([]);

  useEffect(() => {
    startNewRun(selectedColumns);
  }, []);

  useEffect(() => {
    if (selectedColumns) {
      startNewRun(selectedColumns);
    }
  }, [selectedColumns]);

  // const startNewRun = (n) => {
  //   if (averages.length > 0) {
  //     const normalizedVector = normalizeAverages(averages);
  //     setRunHistory(prevHistory => [...prevHistory, normalizedVector]);
  //   }

  //   const shuffledDeck = shuffleDeck(deck);
  //   const newBuckets = Array.from({ length: n }, () => []);
  //   setBuckets(newBuckets);
  //   setRemainingDeck([...shuffledDeck]);
  //   setAverages(new Array(n).fill(0));
  // };


  const startNewRun = (n) => {
    if (averages.length > 0) {
      const normalizedVector = normalizeAverages(averages);
      setRunHistory(prevHistory => [...prevHistory, normalizedVector]);
    }
  
    const shuffledDeck = shuffleDeck(deck);
    const newBuckets = Array.from({ length: n }, () => []);
  
    // Draw unique cards for each bucket
    let uniqueCards = [];
    while (uniqueCards.length < n && shuffledDeck.length > 0) {
      const card = shuffledDeck.shift();
      // Check for duplicate values
      if (!uniqueCards.some(c => c.value === card.value)) {
        uniqueCards.push(card);
      }
    }
  
    // Assign one unique card to each bucket
    uniqueCards.forEach((card, index) => {
      newBuckets[index].push(card);
    });
  
    setBuckets(newBuckets);
    setRemainingDeck([...shuffledDeck]);
    setAverages(uniqueCards.map(card => card.value));
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

  const normalizeAverages = (averages) => {
    const minValue = 1;
    const maxValue = 14;
    return averages.map(avg => ((avg - minValue) / (maxValue - minValue)).toFixed(3));
  };

  // const addNextRow = () => {
  //   if (remainingDeck.length === 0) {
  //     startNewRun(selectedColumns);
  //     return;
  //   }

  //   const updatedBuckets = [...buckets];
  //   let bucketIndex = 0;

  //   for (let i = 0; i < selectedColumns; i++) {
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

  // const handleConfirm = () => {
  //   const dropdown = document.getElementById("columnDropdown");
  //   const selectedValue = dropdown.value;
  //   setSelectedColumns(parseInt(selectedValue, 10));
  //   startNewRun(parseInt(selectedValue, 10));
  // };

  // const handleConfirm = () => {
  //   const dropdown = document.getElementById("columnDropdown");
  //   const selectedValue = dropdown.value;
  //   setSelectedColumns(parseInt(selectedValue, 10));
  
  //   // Reset the run history
  //   setRunHistory([]);
  
  //   // Start a new run with the selected number of columns
  //   startNewRun(parseInt(selectedValue, 10));
  // };
  

  const addNextRow = () => {
    if (remainingDeck.length === 0) {
      startNewRun(selectedColumns);
      return;
    }
  
    const updatedBuckets = [...buckets];
  
    for (let i = 0; i < selectedColumns && remainingDeck.length > 0; i++) {
      const card = remainingDeck.shift();
  
      // Determine the column with the closest average
      let closestColumnIndex = 0;
      let minDifference = Math.abs(card.value - averages[0]);
  
      for (let j = 1; j < updatedBuckets.length; j++) {
        const difference = Math.abs(card.value - averages[j]);
        if (difference < minDifference) {
          minDifference = difference;
          closestColumnIndex = j;
        }
      }
  
      // Handle Ace logic if needed
      if (card.display.startsWith("A") && aceValues[card.display] === undefined && updatedBuckets[closestColumnIndex].length > 0) {
        const currentAverage = averages[closestColumnIndex];
        const aceValue = determineAceValue(currentAverage);
        card.value = aceValue;
        setAceValue(card.display, aceValue);
      }
  
      // Assign the card to the closest column
      updatedBuckets[closestColumnIndex].push(card);
    }
  
    // Update buckets and averages
    setBuckets(updatedBuckets);
    const updatedAverages = updatedBuckets.map(bucket => calculateAverage(bucket));
    setAverages(updatedAverages);
  };
  

  const handleConfirm = () => {
    const dropdown = document.getElementById("columnDropdown");
    const selectedValue = dropdown.value;
    setSelectedColumns(parseInt(selectedValue, 10));
  
    // Reset the run history and clear the UI
    setRunHistory([]);
    
    // Start a new run with the selected number of columns
    startNewRun(parseInt(selectedValue, 10));
  };

  return (
    <ChakraProvider>
      <Header />
      <Box p={5}>
        <Heading mb={6} fontSize="lg">KNN with a deck of cards</Heading>

        <HStack spacing={4} mb={6} align="center">
          <Select
            id="columnDropdown"
            defaultValue="6"
            width="200px"
          >
            <option value="6">6 dimensions</option>
            <option value="3">3 dimensions</option>
            <option value="4">4 dimensions</option>
            <option value="5">5 dimensions</option>
          </Select>

          <Button colorScheme="green" onClick={handleConfirm}>
            Change number of dimensions
          </Button>

          <Button colorScheme="blue" onClick={addNextRow} disabled={selectedColumns === null}>
            Add more observations
          </Button>
        </HStack>

        <Flex justify="space-between" align="flex-start">
          <Box mr={4} p={3} border="1px" borderColor="gray.300" borderRadius="md" boxShadow="md">
            <Text fontWeight="bold" mb={2}>Current Normalized Vector:</Text>
            <Text fontSize="sm">[{normalizeAverages(averages).join(', ')}]</Text>
              {runHistory.length > 0 ? (
                runHistory.map((vector, index) => (
                  <Text key={index} fontSize="sm">Run {index + 1}: [{vector.join(', ')}]</Text>
                ))
              ) : (
                <Text></Text>
              )}

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
