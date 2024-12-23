import React, { createContext, useState, useEffect } from "react";

// Create a context for the app
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State to hold categories and users data
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    // Function to fetch categories and users data
    const fetchData = async () => {
      try {
        // Fetch both categories and users data concurrently
        const [categoriesResponse, usersResponse] = await Promise.all([
          fetch("http://localhost:3000/categories"),
          fetch("http://localhost:3000/users"),
        ]);
        // Update state with fetched data
        setCategories(await categoriesResponse.json());
        setUsers(await usersResponse.json());
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        // Log any errors that occur during the fetch
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

  return (
    // Provide the fetched data to the rest of the app
    <AppContext.Provider value={{ categories, users, loading }}>
      {children}
    </AppContext.Provider>
  );
};
