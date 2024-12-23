import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Textarea,
  Select,
  VStack,
  FormLabel,
} from "@chakra-ui/react";
import { AppContext } from "../components/AppContext";

export const AddEvent = () => {
  const { users, categories } = useContext(AppContext); // Use Context for users and categories
  const [title, setTitle] = useState(""); // State for event title
  const [description, setDescription] = useState(""); // State for event description
  const [image, setImage] = useState(""); // State for event image URL
  const [startTime, setStartTime] = useState(""); // State for event start time
  const [endTime, setEndTime] = useState(""); // State for event end time
  const [categoryIds, setCategoryIds] = useState([]); // State for selected category IDs
  const [location, setLocation] = useState(""); // State for event location
  const [createdBy, setCreatedBy] = useState(""); // State for the creator's ID

  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const newEvent = {
      title,
      description,
      image,
      startTime,
      endTime,
      categoryIds: categoryIds.map(Number), // Ensure categories are numeric
      location,
      createdBy: Number(createdBy), // Ensure createdBy is numeric
    };

    const response = await fetch("http://localhost:3000/events", {
      method: "POST", // Sending a POST request to add a new event
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent), // Convert event data to JSON
    });

    if (response.ok) {
      navigate("/"); // Redirect to events page after successful addition
    } else {
      alert("Failed to add event!"); // Alert user if the event addition fails
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit} // Handle form submission
      padding="4"
      maxWidth="600px"
      margin="0 auto"
    >
      <VStack spacing="4" align="stretch">
        <FormLabel>Title</FormLabel>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update title state on change
          required
        />

        <FormLabel>Description</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Update description state on change
          required
        />

        <FormLabel>Image URL</FormLabel>
        <Input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)} // Update image state on change
          required
        />

        <FormLabel>Start Time</FormLabel>
        <Input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)} // Update start time state on change
          required
        />

        <FormLabel>End Time</FormLabel>
        <Input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)} // Update end time state on change
          required
        />

        <FormLabel>Location</FormLabel>
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)} // Update location state on change
          required
        />

        <FormLabel>Categories</FormLabel>
        <Select
          multiple
          value={categoryIds}
          onChange={(e) =>
            setCategoryIds(
              Array.from(e.target.selectedOptions, (option) => option.value) // Update selected categories
            )
          }
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        <FormLabel>Created By</FormLabel>
        <Select
          placeholder="Select a creator"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)} // Update creator state on change
          required
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>

        <Button type="submit" colorScheme="green" marginTop="4">
          Add Event // Button to submit the form
        </Button>
      </VStack>
    </Box>
  );
};
