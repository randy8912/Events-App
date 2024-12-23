import { useLoaderData, useNavigate } from "react-router-dom";
import { Box, Heading, Image, Text, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";

// Loader function to fetch event details
export const loader = async ({ params }) => {
  // Fetch the event details based on the eventId from the URL parameters
  const eventResponse = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const event = await eventResponse.json();

  // Fetch all categories for the event
  const categoriesResponse = await fetch("http://localhost:3000/categories");
  const categories = await categoriesResponse.json();

  // Fetch all users who might be associated with the event
  const usersResponse = await fetch("http://localhost:3000/users");
  const users = await usersResponse.json();

  // Return the fetched data for use in the component
  return { event, categories, users };
};

export const EventPage = () => {
  const { event, categories, users } = useLoaderData();
  const [isEditing, setIsEditing] = useState(false); // State to track if we are in editing mode
  const [updatedEvent, setUpdatedEvent] = useState(event); // State to hold the updated event data
  const navigate = useNavigate(); // Hook to programmatically navigate
  const toast = useToast(); // Hook to show toast notifications

  // Function to get category names from their IDs
  const getCategoryNames = (categoryIds) => {
    return categoryIds
      .map((id) => categories.find((cat) => cat.id === id)?.name) // Find category names by ID
      .join(", "); // Join names into a single string
  };

  // Function to get the user's name based on their ID
  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId); // Find user by ID
    return user?.name || "Unknown"; // Return name or "Unknown" if not found
  };

  // Function to handle the event update
  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT", // Use PUT method to update the event
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(updatedEvent), // Send the updated event data
      });

      if (response.ok) {
        toast({
          title: "Event updated successfully!", // Show success message
          status: "success",
          duration: 3000,
        });
        setIsEditing(false); // Exit editing mode
      } else {
        toast({
          title: "Failed to update event!", // Show error message
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating event:", error); // Log any errors
    }
  };

  // Function to handle event deletion
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return; // Confirm deletion

    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE", // Use DELETE method to remove the event
      });

      if (response.ok) {
        toast({
          title: "Event deleted successfully!", // Show success message
          status: "success",
          duration: 3000,
        });
        navigate("/"); // Navigate back to the main page
      } else {
        toast({
          title: "Failed to delete event!", // Show error message
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error); // Log any errors
    }
  };

  return (
    <Box>
      {isEditing ? (
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
          <Button onClick={handleEdit} colorScheme="green">
            Save
          </Button>
          <Button onClick={() => setIsEditing(false)} colorScheme="red">
            Cancel
          </Button>
        </Box>
      ) : (
        <Box>
          <Image src={event.image} alt={event.title} />{" "}
          {/* Display event image */}
          <Heading>{event.title}</Heading> {/* Display event title */}
          <Text>{event.description}</Text> {/* Display event description */}
          <Text>
            {event.startTime} - {event.endTime} {/* Display event time range */}
          </Text>
          <Text>Categories: {getCategoryNames(event.categoryIds)}</Text>{" "}
          {/* Display category names */}
          <Text>Created by: {getUserName(event.createdBy)}</Text>{" "}
          {/* Display creator's name */}
          <Button
            onClick={() => setIsEditing(true)} // Set editing mode to true
            colorScheme="blue"
            marginY="2"
          >
            Edit
          </Button>
          <Button onClick={handleDelete} colorScheme="red" marginY="2">
            Delete
          </Button>
        </Box>
      )}
    </Box>
  );
};
