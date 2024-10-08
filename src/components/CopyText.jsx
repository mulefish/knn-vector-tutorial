// TextBlock.js
import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const TextBlock = () => {
  return (
    <Box
      bg="white.50"
      p={8}
      borderRadius="md"
      boxShadow="lg"
      w="100%"             // Set the width to 100%
      borderBottom="1px solid" 
      borderColor="gray.200" // Adding a bottom border for separation
    >
      <VStack spacing={4} align="start" maxW="1200px" mx="auto">  {/* Ensures text stays centered within a max width */}
        <Heading as="h2" size="lg" color="teal.800" textAlign="center" w="100%">
          Chakra: An Introduction to KNN: On Comparing Apples and Oranges and Machine Learning and Vectors
        </Heading>
        <Text fontSize="md" color="gray.700" lineHeight="1.6">
          You can’t compare apples and oranges, they say. But let me tell you something: you absolutely can. You just need to know where to look. The secret is, it’s all about finding the right dimensions.
        </Text>
        <Text fontSize="md" color="gray.700" lineHeight="1.6">
          See, most of us go through life assuming things are different, that they have nothing to do with each other. But when you start paying attention, you find out that everything shares a little something. Apples and oranges? Sure, they look different, taste different, grow on different trees, but if you look closer, you’ll see they’re both just data waiting to be understood. I mean, I’m no expert on fruit, but they’re not as far apart as you think.
        </Text>
        <Text fontSize="md" color="gray.700" lineHeight="1.6">
          Here’s what you do: you take all the little details—the weight, the skin thickness, the color, maybe even the season they ripen in—and you put all that into a space. A bigger space. You start to notice patterns. Apples and oranges aren’t two things—they’re just points on a map, a map with more dimensions than you and I are used to thinking about.
        </Text>
        <Text fontSize="md" color="gray.700" lineHeight="1.6">
          And once you’ve got them in that space, that’s when the magic happens. Because suddenly, you can compare them. You can measure how close they are to each other, not just as fruits, but as data. You’re not comparing apples and oranges anymore. You’re comparing numbers, distances, relationships. And that is what KNN is all about; Prepping the data for machine learning analysis.
        </Text>
        <Text fontSize="md" color="gray.700" lineHeight="1.6">
          Now, let’s talk about this little React app I’ve been working on. It’s a toy model of KNN, but instead of apples and oranges, we’re working with a deck of cards. Here’s how it goes:
        </Text>
        <Text fontSize="md" color="gray.700" lineHeight="1.6">
          First, we start by picking N cards from the deck, one for each column—our “dimensions,” if you will. These cards give us our initial space to work with, just like laying down that first map.
        </Text>
        <Text fontSize="md" color="gray.700" lineHeight="1.6">
          Then, we draw another N cards, one by one, and place them in whichever “bucket” is closest in value. It’s like finding where that card fits best in our little universe, which dimension it belongs to. And we keep doing this, card by card, until the deck is completely empty.
        </Text>
        <Text fontSize="md" color="gray.700" lineHeight="1.6">
          By the time we’re done, we’ve created something called a “run” vector, a string of numbers that tells us how the cards were distributed across those dimensions.
        </Text>
        <Text fontSize="md" color="gray.700" lineHeight="1.6">
          Now, for the toy here the catch is that pulling observations from a smoothly distributed pool of data, like a deck of cards, is almost always going to lead to findings that are about as interesting as watching paint dry. That’s not your fault. It’s because the data itself is, well, pretty dull. There’s no drama, no tension, no story to tell. But if the data were less smooth? Then you can find insights hidden in everyday things.
        </Text>
      </VStack>
    </Box>
  );
};

export default TextBlock;
