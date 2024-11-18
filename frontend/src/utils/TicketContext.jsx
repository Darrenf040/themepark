import React, { createContext, useContext, useState } from "react";

// Create the context
const TicketContext = createContext();

// Create a provider component
// eslint-disable-next-line react/prop-types
export const TicketProvider = ({ children }) => {
  const [childQuantity, setChildQuantity] = useState(0);
  const [adultQuantity, setAdultQuantity] = useState(0);
  const [seniorQuantity, setSeniorQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const totalTickets = childQuantity + adultQuantity + seniorQuantity;

  return (
    <TicketContext.Provider
      value={{
        childQuantity,
        adultQuantity,
        seniorQuantity,
        totalTickets,
        setChildQuantity,
        setAdultQuantity,
        setSeniorQuantity,
        totalPrice,
        setTotalPrice,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

// Custom hook to use the ticket context
export const useTicket = () => useContext(TicketContext);
