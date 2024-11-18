import Button from "./button";
import { Link } from "react-router-dom";
import "./header.css";
import { ShoppingCart } from "phosphor-react";
import { useCart } from "../utils/CartContext";
import { useTicket } from "../utils/TicketContext";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const { totalTickets } = useCart();
  const { childQuantity, adultQuantity, seniorQuantity, totalPrice } =
    useTicket();
  const sidebarRef = useRef(null);

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click was outside the sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarVisible(false); // Close the sidebar
      }
    };

    // Add event listener when sidebar is visible
    if (sidebarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts or sidebar visibility changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarVisible]);
  return (
    <div className="header-container">
      <Link to="/">
        <h1>Themepark</h1>
      </Link>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/rides">Rides</Link>
        <Link to="/dining">Dining</Link>
        <Link to="/events">Events</Link>
        <Link to="/giftshops">Shops</Link>
        <Link to="/ticket">Buy a Ticket</Link>
      </div>
      <div className="header-button-container">
        <Link to="/customer-login">
        <Button buttonClass="loginButton" buttonText="Customer Login" />
        </Link>
        
        <Link to="/login">
          <Button buttonClass="loginButton" buttonText="Staff Login" />
        </Link>
        <Link to={"/customer-account"}>Account Details</Link>
        <div className="cart-sidebar-toggle" onClick={toggleSidebar}>
          <div className="cart-icon-wrapper">
            <ShoppingCart className="cart-icon" size={32} />
            <div className="cart-count">{totalTickets}</div>
          </div>
        </div>
      </div>

      {/* Apply the "show" class when the sidebar should be visible */}
      {sidebarVisible && (
        <div
          ref={sidebarRef}
          className={`cart-sidebar ${sidebarVisible ? "show" : ""}`}
        >
          <div className="cart-items">
            <h2>Shopping Cart</h2>
            {/* Render a list of tickets here */}
            <p>Child Tickets: {childQuantity}</p>
            <p>Adult Tickets: {adultQuantity}</p>
            <p>Senior Tickets: {seniorQuantity}</p>
            <p>Total Tickets: {totalTickets}</p>
            <p>Total Price: ${totalPrice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
