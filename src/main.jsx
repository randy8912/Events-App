import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { EventsPage } from "./pages/EventsPage";
import { EventPage, loader as eventLoader } from "./pages/EventPage";
import { AddEvent } from "./components/AddEvent";
import { AppProvider } from "./components/AppContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
      },
      {
        path: "/event/:eventId",
        element: <EventPage />,
        loader: eventLoader,
      },
      {
        path: "/add-event",
        element: <AddEvent />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </AppProvider>
  </React.StrictMode>
);
