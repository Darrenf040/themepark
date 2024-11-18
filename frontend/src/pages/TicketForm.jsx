import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/header";
import "./ticketForm.css";
import { useTicket } from "../utils/TicketContext";
import { useCart } from "../utils/CartContext";

const TicketForm = () => {
  const { totalTickets, setTotalTickets } = useCart();
  // prettier-ignore
  const { childQuantity, adultQuantity, seniorQuantity, setChildQuantity, 
    setAdultQuantity, setSeniorQuantity, totalPrice,
    setTotalPrice,
} = useTicket();
  // Initialize state for form data
  const [visitDate, setVisitDate] = useState({});

  // Prices for each ticket type
  const ticketPrices = {
    child: 30, // Example price for child tickets
    adult: 40, // Example price for adult tickets
    senior: 25, // Example price for senior tickets
  };

  // Recalculate total tickets and price whenever quantities change
  useEffect(() => {
    const total = childQuantity + adultQuantity + seniorQuantity;
    setTotalTickets(total);

    const price =
      childQuantity * ticketPrices.child +
      adultQuantity * ticketPrices.adult +
      seniorQuantity * ticketPrices.senior;
    setTotalPrice(price);
  }, [childQuantity, adultQuantity, seniorQuantity]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const customerID = 78998509;
    const tickets = [
      { type: 0, quantity: childQuantity }, // child
      { type: 1, quantity: adultQuantity }, // adult
      { type: 2, quantity: seniorQuantity }, //senior
    ];
    const { date } = visitDate;

    const payload = {
      customerID,
      tickets,
      date,
    };

    // Example of sending data to the server (you can replace the URL)
    axios
      .post(
        "http://localhost:3000/tickets/purchase-tickets",
        payload
      )
      .then((response) => {
        console.log("Purchase successful", response.data);
        // Optionally, handle response (redirect, alert, etc.)
      })
      .catch((error) => {
        console.error("Error purchasing tickets:", error);
      });
  };

  return (
    <>
      <Header />
      <div className="dataentryformcontainer">
        <h1>Purchase Ticket</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="child">Child Ticket ${ticketPrices.child}</label>
          <div className="quantity-selector">
            <input
              type="text"
              name="child"
              id="child"
              value={childQuantity}
              readOnly
            />
            <button
              type="button"
              onClick={() => setChildQuantity((prev) => prev + 1)}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setChildQuantity((prev) => Math.max(prev - 1, 0))}
            >
              -
            </button>
          </div>

          <label htmlFor="adult">Adult Ticket ${ticketPrices.adult}</label>
          <div className="quantity-selector">
            <input
              type="text"
              name="adult"
              id="adult"
              value={adultQuantity}
              readOnly
            />
            <button
              type="button"
              onClick={() => setAdultQuantity((prev) => prev + 1)}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setAdultQuantity((prev) => Math.max(prev - 1, 0))}
            >
              -
            </button>
          </div>

          <label htmlFor="senior">Senior Ticket ${ticketPrices.senior}</label>
          <div className="quantity-selector">
            <input
              type="text"
              name="senior"
              id="senior"
              value={seniorQuantity}
              readOnly
            />
            <button
              type="button"
              onClick={() => setSeniorQuantity((prev) => prev + 1)}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setSeniorQuantity((prev) => Math.max(prev - 1, 0))}
            >
              -
            </button>
          </div>
          <div className="ticket-date-container">
            <label htmlFor="date">Plan Your Vist</label>
            <input
              type="date"
              onChange={(e) =>
                setVisitDate({ ...visitDate, date: e.target.value })
              }
            />
          </div>

          {/* Display Total Tickets and Total Price */}
          <div className="cart-summary">
            <p>Total Tickets: {totalTickets}</p>
            <p>Total Price: ${totalPrice}</p>
          </div>

          <button type="submit">Purchase</button>
        </form>
      </div>
    </>
  );
};

export default TicketForm;
