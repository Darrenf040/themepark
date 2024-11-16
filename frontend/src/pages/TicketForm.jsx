// TicketForm.jsx
import { useState } from "react";
import axios from "axios";
import Header from "../components/header";

const TicketForm = () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Calculate default expiry date (e.g., one week from today)
  const expiryDateDefault = new Date();
  expiryDateDefault.setDate(expiryDateDefault.getDate() + 7);
  const defaultExpiryDate = expiryDateDefault.toISOString().split("T")[0];

  // Initialize state for form data
  const [formData, setFormData] = useState({
    // Customer information
    Fname: "",
    Minitial: "",
    Lname: "",
    Age: "",
    phoneNumber: "",
    streetAddress: "",
    City: "",
    State: "",
    ZIP: "",
    Email: "",
    password: "",
    startDate: "",
    expiryDate:"",
    // Ticket information
    ticketType: "", // Should be an integer representing ticket type

   
  });

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // For Age and ticketType, ensure we store numbers
    let newValue = value;
    if (name === "Age" || name === "ticketType") {
      newValue = value === "" ? "" : parseInt(value);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to backend
      const response = await axios.post(
        "https://themepark-backend.onrender.com//tickets/create",
        formData
      );

      alert(`Ticket purchased successfully! Your Ticket ID is ${response.data.ticketID}`);
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      alert("There was an error processing your request.");
    }
  };

  return (
    <>
      <Header />
      <div className="dataentryformcontainer">
        
      <h1>Purchase Ticket</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <h2 className="purchase">Customer Information</h2>
          <label>First Name:</label>
          <input
            type="text"
            name="Fname"
            value={formData.Fname}
            onChange={(e) => setFormData({ ...formData, Fname: e.target.value })}            required
          />

          <label>Middle Initial:</label>
          <input
            type="text"
            name="Minitial"
            value={formData.Minitial}
            onChange={(e) => setFormData({ ...formData, Minitial: e.target.value })}            maxLength="1"
          />

          <label>Last Name:</label>
          <input
            type="text"
            name="Lname"
            value={formData.Lname}
            onChange={(e) => setFormData({ ...formData, Lname: e.target.value })}            required
          />

          <label>Age:</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={(e) => setFormData({ ...formData, Age: e.target.value })}            required
            min="0"
          />

          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}            required
            maxLength="10"
          />

          <label>Street Address:</label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}            required
          />

          <label>City:</label>
          <input
            type="text"
            name="City"
            value={formData.City}
            onChange={(e) => setFormData({ ...formData, City: e.target.value })}            required
          />

          <label>State:</label>
          <input
            type="text"
            name="State"
            value={formData.State}
            onChange={(e) => setFormData({ ...formData, State: e.target.value })}            required
            maxLength="2"
          />

          <label>ZIP Code:</label>
          <input
            type="text"
            name="ZIP"
            value={formData.ZIP}
            onChange={(e) => setFormData({ ...formData, ZIP: e.target.value })}            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={(e) => setFormData({ ...formData, Email: e.target.value })}            required
            maxLength="50"
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}            required
          />

          {/* Ticket Information */}
          <h2>Ticket Information</h2>
          <label>Ticket Type:</label>
          <select
            name="ticketType"
            value={formData.ticketType}
            onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}            required
          >
            <option value="">Select Ticket Type</option>
            <option value="0">Child</option>
            <option value="1">Adult</option>
            <option value="2">Senior</option>
          </select>

          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}            required
          />

          <label>Expiry Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}            required
          />

          {/* Submit Button */}
          <button type="submit">Purchase Ticket</button>
        </form>
      </div>
    </>
  );
};

export default TicketForm;
