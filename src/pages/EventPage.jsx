import { useContext, useState } from "react";
import { AppContext } from "../components/AppContext";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  useToast,
  HStack,
} from "@chakra-ui/react";

// Loader function to fetch event data based on eventId from the URL parameters
export const loader = async ({ params }) => {
  try {
    const response = await fetch(
      `http://localhost:3000/events/${params.eventId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch event data.");
    }
    const event = await response.json();
    return event; // Return the fetched event data
  } catch (error) {
    console.error("Error fetching event:", error);
    return null; // Return null if fetching fails
  }
};

export const EventPage = () => {
  const { categories, users, loading } = useContext(AppContext); // Get context values
  const event = useLoaderData(); // Load event data from the loader
  const [isEditing, setIsEditing] = useState(false); // State to track if we are in editing mode
  const [updatedEvent, setUpdatedEvent] = useState(event || {}); // Fallback to an empty object if event is null
  const navigate = useNavigate(); // Hook to programmatically navigate
  const toast = useToast(); // Hook to show toast notifications

  // Function to get category names based on category IDs
  const getCategoryNames = (categoryIds = []) => {
    return categoryIds
      .map((id) => categories.find((cat) => cat.id === id)?.name) // Find category names
      .filter(Boolean) // Filter out any undefined values
      .join(", "); // Join names into a single string
  };

  // Function to get user details based on user ID
  const getUserDetails = (userId) => {
    const user = users.find((user) => user.id === userId); // Find user by ID
    return user || { name: "Unknown", image: "" }; // Return user or default values
  };

  // Function to handle event deletion
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return; // Confirm deletion

    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE", // Send DELETE request
      });

      if (response.ok) {
        toast({
          title: "Event deleted successfully!",
          status: "success",
          duration: 3000,
        });
        navigate("/"); // Redirect to events page after deletion
      } else {
        toast({
          title: "Failed to delete the event.",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred while deleting the event.",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  if (loading) return <Text>Loading...</Text>; // Show loading text while data is being fetched
  if (!event) return <Text>Event not found or an error occurred.</Text>; // Handle missing event

  const { name, image } = getUserDetails(event.createdBy); // Get creator's details

  return (
    <Box>
      {isEditing ? ( // Conditional rendering based on editing state
        <Box>
          <Heading>Edit Event</Heading>
          <input
            type="text"
            value={updatedEvent.title} // Bind input value to updatedEvent title
            onChange={
              (e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value }) // Update title on change
            }
          />
          <textarea
            value={updatedEvent.description} // Bind textarea value to updatedEvent description
            onChange={
              (e) =>
                setUpdatedEvent({
                  ...updatedEvent,
                  description: e.target.value,
                }) // Update description on change
            }
          />
          <Button
            colorScheme="green"
            onClick={() => {
              // Implement save functionality
              setIsEditing(false); // Exit editing mode
            }}
          >
            Save
          </Button>
          <Button colorScheme="red" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Box>
      ) : (
        <Box>
          <Image src={event.image} alt={event.title} />
          <Heading>{event.title}</Heading>
          <Text>{event.description}</Text>
          <Text>
            Starts at: {event.startTime} - Ends at: {event.endTime}
          </Text>
          <Text>Categories: {getCategoryNames(event.categoryIds)}</Text>
          <HStack alignItems="center" marginTop="4">
            <Image
              src={image}
              alt={name}
              borderRadius="full"
              boxSize="100px"
              marginRight="4"
            />
            <Text>Created by: {name}</Text>
          </HStack>
          <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button colorScheme="red" onClick={handleDelete} marginTop="2">
            Delete
          </Button>
        </Box>
      )}
    </Box>
  );
};
