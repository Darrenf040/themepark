// ShopForm.js
import { useState } from "react";
import Select from "react-select";
import axios from "axios";
import EmployeeHeader from "../components/employeeHeader";

const ShopForm = () => {
  const [formData, setFormData] = useState({
    shopType: 0, // Default to 'Gift shop' (0 for Gift shop, 1 for restaurant)
    shopName: "", // Name of the shop or restaurant
    location: "", // Location of the shop or restaurant
    products: [], // Array of products with name and price
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle dropdown selection for type
  const handleTypeChange = (selectedOption) => {
    setFormData({ ...formData, shopType: selectedOption.value });
  };

  // Add new product input fields
  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: "", price: "" }],
    });
  };

  // Handle changes in product fields
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index][name] = value;
    setFormData({ ...formData, products: updatedProducts });
  };

  // Handle form submission with axios
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your backend API endpoint for shop/restaurant creation
      const response = await axios.post(
        "https://themepark-backend.onrender.com//shops/create",
        formData
      );
      alert(`Ticket created successfully:`);

      // Clear form data after submission
      setFormData({
        shopType: 0,
        shopName: "",
        location: "",
        products: [],
      });
    } catch (error) {
      console.error("Error creating entry:", error);
      alert("Error creating entry. Please try again.");
    }
  };

  return (
    <>
      <EmployeeHeader />
      <div className="dataentryformcontainer">
        <h1>Add New Shop or Restaurant Entry</h1>
        <form onSubmit={handleSubmit}>
          {/* Type Selection Dropdown */}
          <label>Type:</label>
          <Select
            name="shopType"
            options={[
              { value: 0, label: "Gift Shop" }, // "Shop" mapped to 0
              { value: 1, label: "Restaurant" }, // "Restaurant" mapped to 1
            ]}
            value={{
              value: formData.shopType,
              label: formData.shopType === 0 ? "Gift Shop" : "Restaurant",
            }}
            onChange={handleTypeChange}
            placeholder="Select Type"
            required
          />

          {/* Shop Name */}
          <label>Name:</label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            required
          />

          {/* Location */}
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          {/* Products Section */}
          <label>Products:</label>
          {formData &&
            formData.products.map((product, index) => (
              <div key={index} className="product-entry">
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Product Name"
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Product Price"
                  required
                />
              </div>
            ))}

          {/* Add More Product Button */}
          <button type="button" onClick={handleAddProduct}>
            Add More Product
          </button>

          {/* Submit Button */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default ShopForm;
