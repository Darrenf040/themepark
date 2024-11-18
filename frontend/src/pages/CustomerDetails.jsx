// CustomerDetails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/header";
import "./CustomerDetails.css"; // Import the CSS file

const CustomerDetails = () => {
  const [customerData, setCustomerData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({});
  const customerID = 78998509; // Hardcoded customer ID for testing

  useEffect(() => {
    // Fetch customer details on component mount
    axios
      .get(`https://themepark-backend.onrender.com/customers/read/${customerID}`)
      .then((response) => {
        setCustomerData(response.data);
        setFormValues(response.data); // Initialize form values
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
      });

    // Fetch customer tickets
    axios
      .get(`https://themepark-backend.onrender.com/customers/tickets/${customerID}`)
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer tickets:", error);
      });
  }, [customerID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSaveChanges = () => {
    // Prepare data to send to the backend
    const dataToUpdate = {
      customerID,
      ...formValues,
    };

    axios
      .put("https://themepark-backend.onrender.com/customers/update", dataToUpdate)
      .then((response) => {
        setCustomerData(formValues);
        setIsEditing(false);
        alert("Your details have been updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating customer details:", error);
        alert("Failed to update your details. Please try again.");
      });
  };

  if (!customerData) {
    return (
      <>
        <Header />
        <div className="customer-details-container">
          <p>Loading your details...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="customer-details-container">
        <h1>Your Account Details</h1>
        {isEditing ? (
          <div className="customer-edit-form">
            <div className="form-group">
              <label htmlFor="Fname">First Name:</label>
              <input
                type="text"
                name="Fname"
                id="Fname"
                value={formValues.Fname || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Minitial">Middle Initial:</label>
              <input
                type="text"
                name="Minitial"
                id="Minitial"
                value={formValues.Minitial || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Lname">Last Name:</label>
              <input
                type="text"
                name="Lname"
                id="Lname"
                value={formValues.Lname || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Age">Age:</label>
              <input
                type="number"
                name="Age"
                id="Age"
                value={formValues.Age || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={formValues.phoneNumber || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="streetAddress">Street Address:</label>
              <input
                type="text"
                name="streetAddress"
                id="streetAddress"
                value={formValues.streetAddress || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="City">City:</label>
              <input
                type="text"
                name="City"
                id="City"
                value={formValues.City || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="State">State:</label>
              <input
                type="text"
                name="State"
                id="State"
                value={formValues.State || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ZIP">ZIP Code:</label>
              <input
                type="text"
                name="ZIP"
                id="ZIP"
                value={formValues.ZIP || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="button-group">
              <button className="save-button" onClick={handleSaveChanges}>
                Save Changes
              </button>
              <button
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="customer-info">
              <p>
                <strong>Name:</strong>{" "}
                {`${customerData.Fname} ${customerData.Minitial || ""} ${
                  customerData.Lname
                }`}
              </p>
              <p>
                <strong>Age:</strong> {customerData.Age}
              </p>
              <p>
                <strong>Phone Number:</strong> {customerData.phoneNumber}
              </p>
              <p>
                <strong>Street Address:</strong> {customerData.streetAddress}
              </p>
              <p>
                <strong>City:</strong> {customerData.City}
              </p>
              <p>
                <strong>State:</strong> {customerData.State}
              </p>
              <p>
                <strong>ZIP Code:</strong> {customerData.ZIP}
              </p>
              <div className="button-group">
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Details
                </button>
              </div>
            </div>

            { /*Tickets Section */ }
            <div className="customer-tickets">
              <h2>Your Tickets</h2>
              {tickets.length > 0 ? (
                <table className="tickets-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Type</th>
                      <th>Start Date</th>
                      <th>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.ticketID}>
                        <td>{ticket.ticketID}</td>
                        <td>{getTicketTypeName(ticket.ticketType)}</td>
                        <td>{formatDate(ticket.startDate)}</td>
                        <td>{formatDate(ticket.expiryDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>You have no tickets at the moment.</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

// Helper function to get ticket type name
const getTicketTypeName = (ticketType) => {
  const ticketTypes = {
    0: "Child",
    1: "Adult",
    2: "Senior",
  };
  return ticketTypes[ticketType] || "Unknown";
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default CustomerDetails;



