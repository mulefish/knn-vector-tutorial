// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import './styles.css';
import useCards from './hooks/useCards';
import useShuffle from './hooks/useShuffle';
import useAceLogic from './hooks/useAceLogic';
import useAverages from './hooks/useAverages';
import { useDispatch, useSelector } from 'react-redux';
import { addRun as recordRun, resetHistory as resetRunHistory } from './redux/runHistory/runHistorySlice';
import { ChakraProvider, Box, Heading, Text, Button, Select, HStack, Flex } from '@chakra-ui/react';
import Header from './Header.jsx';
import Card from './components/Card';
import RunHistoryChart from './components/RunHistoryChart';
import TextBlock from './components/CopyText';

const App = () => {
  const { deck } = useCards();
  const { shuffleDeck } = useShuffle();
  const { aceValues, determineAceValue, setAceValue } = useAceLogic();
  const { averages, setAverages, calculateAverage, normalizeAverages } = useAverages();

  const runHistory = useSelector((state) => state.runHistory.history);
  const dispatch = useDispatch();

  const [buckets, setBuckets] = useState([]);
  const [remainingDeck, setRemainingDeck] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(6);

  // Memoized function to avoid unnecessary recreations
  const startNewRun = useCallback((n) => {
    if (averages.length > 0) {
      dispatch(recordRun(normalizeAverages(averages)));
    }

    const shuffledDeck = shuffleDeck(deck);
    const newBuckets = Array.from({ length: n }, () => []);

    // Ensure each bucket gets a unique card initially
    let uniqueCards = [];
    while (uniqueCards.length < n && shuffledDeck.length > 0) {
      const card = shuffledDeck.shift();
      if (!uniqueCards.some(c => c.value === card.value)) {
        uniqueCards.push(card);
      }
    }

    uniqueCards.forEach((card, index) => {
      newBuckets[index].push(card);
    });

    setBuckets(newBuckets);
    setRemainingDeck([...shuffledDeck]);
    setAverages(uniqueCards.map(card => card.value));
  }, [dispatch, shuffleDeck, deck, averages, normalizeAverages, setAverages]);

  useEffect(() => {
    startNewRun(selectedColumns);
  }, []); 

  const addNextRow = () => {
    if (remainingDeck.length === 0) {
      startNewRun(selectedColumns);
      return;
    }

    const updatedBuckets = [...buckets];

    for (let i = 0; i < selectedColumns && remainingDeck.length > 0; i++) {
      const card = remainingDeck.shift();

      let closestColumnIndex = 0;
      let minDifference = Math.abs(card.value - averages[0]);

      for (let j = 1; j < updatedBuckets.length; j++) {
        const difference = Math.abs(card.value - averages[j]);
        if (difference < minDifference) {
          minDifference = difference;
          closestColumnIndex = j;
        }
      }

      if (card.display.startsWith("A") && aceValues[card.display] === undefined && updatedBuckets[closestColumnIndex].length > 0) {
        const currentAverage = averages[closestColumnIndex];
        const aceValue = determineAceValue(currentAverage);
        card.value = aceValue;
        setAceValue(card.display, aceValue);
      }

      updatedBuckets[closestColumnIndex].push(card);
    }

    setBuckets(updatedBuckets);
    const updatedAverages = updatedBuckets.map(bucket => calculateAverage(bucket, aceValues));
    setAverages(updatedAverages);
  };

  const handleConfirm = () => {
    const dropdown = document.getElementById("columnDropdown");
    const selectedValue = dropdown.value;
    setSelectedColumns(parseInt(selectedValue, 10));
    dispatch(resetRunHistory());
    startNewRun(parseInt(selectedValue, 10));
  };

  return (
    <ChakraProvider>
      <Header />
      <TextBlock />
      <Box p={5}>
        <Heading mb={6} fontSize="lg">KNN with a deck of cards</Heading>

        <HStack spacing={4} mb={6} align="center">
          <Select id="columnDropdown" defaultValue="6" width="200px">
            <option value="6">6 dimensions</option>
            <option value="3">3 dimensions</option>
            <option value="4">4 dimensions</option>
            <option value="5">5 dimensions</option>
          </Select>

          <Button colorScheme="blue" onClick={handleConfirm}>
            Change number of dimensions
          </Button>

          <Button colorScheme="blue" onClick={addNextRow} disabled={selectedColumns === null}>
            Add more observations ( click many times to cycle threw the deck)
          </Button>
        </HStack>

        {/* Adjust Flex to position vectors, chart, and card grid side by side */}
        <Flex justify="space-between" align="flex-start">
          {/* Vector and History Display */}
          <Box mr={4} p={3} border="1px" borderColor="gray.300" borderRadius="md" boxShadow="md">
            <Text fontWeight="bold" mb={2}>Current Normalized Vector:</Text>
            <Text fontSize="sm">[{normalizeAverages(averages || []).join(', ')}]</Text>
            {runHistory.length > 0 ? (
              runHistory.map((vector, index) => (
                <Text key={index} fontSize="sm">Run {index + 1}: [{vector.join(', ')}]</Text>
              ))
            ) : (
              <Text>No runs recorded yet.</Text>
            )}
          </Box>

          {/* Chart container positioned next to the vectors */}
          <Box mr={4} p={3} border="1px" borderColor="gray.300" borderRadius="md" boxShadow="md">
            <RunHistoryChart /> 
          </Box>

          {/* Card Grid */}
          <div className="card-grid" style={{ flex: 1 }}>
            {buckets.map((bucket, index) => (
              <div key={index} className="card-column">
                <Text mb={2}>Average: {averages[index]}</Text>
                {bucket.map((card, idx) => (
                  <Card key={idx} card={card} />
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
