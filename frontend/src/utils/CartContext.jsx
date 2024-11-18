import { createContext, useContext, useState } from "react";

// Create CartContext
const CartContext = createContext();

// Custom hook to use CartContext
export const useCart = () => useContext(CartContext);

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const [totalTickets, setTotalTickets] = useState(0);

  // Provide both the totalTickets and setTotalTickets function
  return (
    //totalTickets and setTotalTickets function variables provider to be used/updated globally
    <CartContext.Provider value={{ totalTickets, setTotalTickets }}>
      {children}
    </CartContext.Provider>
  );
};
