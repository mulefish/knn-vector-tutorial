import React from 'react';
import { Box, Link, Text } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box p={5} bg="gray.100" borderBottom="1px solid" borderColor="gray.300">
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        Check out the repository:
      </Text>
      <Link
        href="https://github.com/mulefish/knn-vector-tutorial"
        isExternal
        fontSize="lg"
        color="teal.500"
        fontWeight="bold"
        _hover={{ textDecoration: 'underline', color: 'teal.600' }}
        p={2}
        border="1px solid"
        borderRadius="md"
        borderColor="teal.500"
      >
        https://github.com/mulefish/knn-vector-tutorial
      </Link>
    </Box>
  );
};

export default Header;
