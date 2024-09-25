// src/components/Card.jsx
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Card = ({ card }) => {
  const getSuite = () => { 
    if ( card.display.includes("♣")) {
      return "♣"
    } else if ( card.display.includes("♥")) {
      return "♥"
    } else if ( card.display.includes("♠")) {
      return "♠"
    } else if ( card.display.includes("♦")) {
      return "♦"
    }
  }
  const getSpecial = () => { 
    // Aces do not know their value until later - reflect that in the UI
    if ( card.display.startsWith("A")) {
      if ( card.value === 14 ) {
        return "↑"
      } else if ( card.value === 1 ) { 
        return "↓"
      } else {
        return "?"
      }
    } else {
      return ""
    }
  }
  const getColor = () => {
    if ( card.display.includes("♥") || card.display.includes("♦") ) { 
      return "red"
    } else {
      return "black"
    }
  }
  const suite = getSuite() 
  const cardColor = getColor() 
  const special = getSpecial()
  // const isAce = card.display.startsWith('A');
  // const cardColor = card.display.includes("♥") || card.display.includes("♦") ? 'red' : 'black';
  
  return (
    <Box
      className={`card ${cardColor}`}
      p={2}
      m={1}
      border="1px solid"
      borderColor={cardColor === 'red' ? 'red.500' : 'black'}
      borderRadius="md"
    >
      <Text className="card-value">{card.value}{suite} {special}</Text>
      {/* <Text className="card-value">
        {isAce 
          ? `A${card.display.slice(1)} ${card.value === 14 ? '14' : card.value === 1 ? '1' : '?'}`
          : `${card.value} ---- |${card.display.slice(1)}|`
        }
      </Text> */}
    </Box>
  );
};

export default Card;
