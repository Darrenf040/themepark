// TicketForm.js
import { useState } from "react";
import Select from "react-select";
import axios from "axios";
import Header from "../components/header";

const TicketForm = () => {
  // Get today's date in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Calculate default expiry date (one week from today)
  const expiryDateDefault = new Date();
  expiryDateDefault.setDate(expiryDateDefault.getDate() + 7);
  const defaultExpiryDate = expiryDateDefault.toISOString().split("T")[0];

  // default start and expiry dates
  const [ticketData, setTicketData] = useState({
    ticketType: "", // Store selected ticket type
    ticketPrice: "", // Store selected ticket price
    startDate: today, // Default start date to today
    expiryDate: defaultExpiryDate, // Default expiry date to one week from today
  });

  //  options for ticket types with prices
  const ticketTypeOptions = [
    { value: 0, label: "Children - $10", price: 10 },
    { value: 1, label: "Adult - $15", price: 15 },
    { value: 2, label: "Senior - $12", price: 12 },
  ];

  // Handle ticket type selection change
  const handleSelectChange = (selectedOption) => {
    setTicketData({
      ...ticketData,
      ticketType: selectedOption.value,
      ticketPrice: selectedOption.price,
    });
  };

  // Handle input changes for other fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to the server API
      const response = await axios.post(
        "https://gleaming-lokum-158537.netlify.app/tickets/create",
        ticketData
      );
      alert(`Ticket created with ID: ${response.data.ticketID}`);
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="dataentryformcontainer">
        <h1>Add New Ticket</h1>
        <form onSubmit={handleSubmit}>
          {/* Ticket type dropdown */}
          <label>Ticket Type:</label>
          <Select
            options={ticketTypeOptions}
            onChange={handleSelectChange}
            placeholder="Select Ticket Type"
            required
          />

          {/* Start date input, defaulting to today's date */}
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={ticketData.startDate}
            onChange={handleChange}
            required
          />

          {/* Expiry date input, defaulting to one week from today */}
          <label>Expiry Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={ticketData.expiryDate}
            onChange={handleChange}
            required
          />

          {/* Submit button */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default TicketForm;
