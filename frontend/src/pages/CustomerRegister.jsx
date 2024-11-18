import React, { useState } from "react";
import axios from "axios";
import Header from "../components/header"; // Adjust the path based on your project structure
import { useNavigate } from "react-router-dom"; // For navigation after registration
import "./CustomerRegister.css"; // Import the CSS file for styling

const CustomerRegister = () => {
  // State variables for form inputs
  const [formData, setFormData] = useState({
    Email: "",
    password: "",
    Fname: "",
    Lname: "",
    Age: "",
    phoneNumber: "",
    streetAddress: "",
    City: "",
    State: "",
    ZIP: "",
    Minitial: "", // Optional
  });

  // State variables for handling success and error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Hook for navigation

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Send POST request to /customers/register
      const response = await axios.post("http://localhost:3000/customer/register", formData);

      // Handle successful registration
      if (response.status === 201) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setFormData({
          Email: "",
          password: "",
          Fname: "",
          Lname: "",
          Age: "",
          phoneNumber: "",
          streetAddress: "",
          City: "",
          State: "",
          ZIP: "",
          Minitial: "",
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/customer-login"); // Adjust the path based on your routing setup
        }, 2000); // 2-second delay
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status other than 2xx
        setErrorMessage(error.response.data.error || "Registration failed.");
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage("No response from server. Please try again later.");
      } else {
        // Something else caused the error
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="register-container">
        <h1>Register as a New Customer</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="Email">Email:</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {/* First Name Field */}
          <div className="form-group">
            <label htmlFor="Fname">First Name:</label>
            <input
              type="text"
              id="Fname"
              name="Fname"
              value={formData.Fname}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
          </div>

          {/* Last Name Field */}
          <div className="form-group">
            <label htmlFor="Lname">Last Name:</label>
            <input
              type="text"
              id="Lname"
              name="Lname"
              value={formData.Lname}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
          </div>

          {/* Middle Initial Field (Optional) */}
          <div className="form-group">
            <label htmlFor="Minitial">Middle Initial (Optional):</label>
            <input
              type="text"
              id="Minitial"
              name="Minitial"
              value={formData.Minitial}
              onChange={handleChange}
              maxLength="1"
              placeholder="M"
            />
          </div>

          {/* Age Field */}
          <div className="form-group">
            <label htmlFor="Age">Age:</label>
            <input
              type="number"
              id="Age"
              name="Age"
              value={formData.Age}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter your age"
            />
          </div>

          {/* Phone Number Field */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          {/* Street Address Field */}
          <div className="form-group">
            <label htmlFor="streetAddress">Street Address:</label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              required
              placeholder="Enter your street address"
            />
          </div>

          {/* City Field */}
          <div className="form-group">
            <label htmlFor="City">City:</label>
            <input
              type="text"
              id="City"
              name="City"
              value={formData.City}
              onChange={handleChange}
              required
              placeholder="Enter your city"
            />
          </div>

          {/* State Field */}
          <div className="form-group">
            <label htmlFor="State">State:</label>
            <input
              type="text"
              id="State"
              name="State"
              value={formData.State}
              onChange={handleChange}
              required
              placeholder="Enter your state"
            />
          </div>

          {/* ZIP Code Field */}
          <div className="form-group">
            <label htmlFor="ZIP">ZIP Code:</label>
            <input
              type="text"
              id="ZIP"
              name="ZIP"
              value={formData.ZIP}
              onChange={handleChange}
              required
              placeholder="Enter your ZIP code"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        {/* Success Message */}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {/* Error Message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </>
  );
};

export default CustomerRegister;
