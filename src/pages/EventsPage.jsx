import React from "react";
import { useContext, useState } from "react";
import { AppContext } from "../components/AppContext";
import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  Input,
  Select,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const EventsPage = () => {
  const { categories, loading } = useContext(AppContext);
  const [events, setEvents] = useState([]); // State to hold the list of events
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [filterCategory, setFilterCategory] = useState(""); // State for the selected category filter

  React.useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("http://localhost:3000/events"); // Fetch events from the API
      setEvents(await response.json()); // Update state with the fetched events
    };
    fetchEvents(); // Call the fetch function
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" || // If no search query, match all events
      event.title.toLowerCase().includes(searchQuery.toLowerCase()); // Check if event title includes the search query
    const matchesCategory =
      filterCategory === "" || // If no category filter, match all events
      event.categoryIds.includes(Number(filterCategory)); // Check if event belongs to the selected category
    return matchesSearch && matchesCategory; // Return true if both conditions are met
  });

  if (loading) return <Text>Loading...</Text>; // Show loading text while fetching data

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" marginBottom="4">
        <Input
          placeholder="Search events" // Placeholder for the search input
          value={searchQuery} // Controlled input for search query
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
          width="60%"
        />
        <Select
          placeholder="Filter by category" // Placeholder for the category filter
          value={filterCategory} // Controlled input for category filter
          onChange={(e) => setFilterCategory(e.target.value)} // Update category filter on selection
          width="30%"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Box>
      {filteredEvents.map((event) => (
        <Box
          key={event.id}
          border="1px"
          borderRadius="md"
          padding="4"
          marginY="2"
        >
          <Image
            src={event.image || "https://via.placeholder.com/150"} // Fallback image if event image is not available
            alt={event.title} // Alt text for the image
          />
          <Heading size="md">{event.title}</Heading>
          <Text>{event.description}</Text>
          <Text>
            Starts at: {event.startTime} - Ends at: {event.endTime}
          </Text>
          <Button
            as={Link}
            to={`/event/${event.id}`} // Link to event details page
            colorScheme="blue"
            marginTop="2"
          >
            View Details
          </Button>
        </Box>
      ))}
    </Box>
  );
};
