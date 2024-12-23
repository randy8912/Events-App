import { Link } from "react-router-dom";
import { Box, HStack, Button } from "@chakra-ui/react";

export const Navigation = () => (
  <Box as="nav" padding="4" borderBottom="1px" marginBottom="4">
    <HStack spacing="4">
      <Button as={Link} to="/" colorScheme="blue">
        Events
      </Button>
      <Button as={Link} to="/add-event" colorScheme="green">
        Add Event
      </Button>
    </HStack>
  </Box>
);
