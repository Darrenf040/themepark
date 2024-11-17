import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./GiftShopForm.css";
import EmployeeHeader from "../components/employeeHeader";
import "./DataForm.css";

Modal.setAppElement("#root");

const GiftShopForm = () => {
    const [shops, setShops] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        shopID: "",
        shopName: "",
        location: "",
        shopType: "",
        shopDesc: "",
        imageFileName: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            const response = await axios.get("https://themepark-backend.onrender.com/shops/read");
            setShops(response.data.result);
        } catch (error) {
            console.error("Error fetching shops:", error);
        }
    };

    const openModal = (shop = null) => {
        setIsEditMode(!!shop);
        setFormData(
            shop || {
                shopID: "",
                shopName: "",
                location: "",
                shopType: "",
                shopDesc: "",
                imageFileName: "",
            }
        );
        setModalIsOpen(true);
    };

    const closeModal = () => setModalIsOpen(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
          ...formData,
          [name]: name === "shopType" ? parseInt(value, 10) : value, // Convert shopType to number
      });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axios.put(`https://themepark-backend.onrender.com/shops/${formData.shopID}`, formData);
            } else {
                await axios.post("https://themepark-backend.onrender.com/shops/create", formData);
            }
            fetchShops();
            closeModal();
        } catch (error) {
            console.error("Error saving shop:", error);
        }
    };

    const handleDelete = async (shopID) => {
        if (window.confirm("Are you sure you want to delete this shop?")) {
            try {
                await axios.delete(`https://themepark-backend.onrender.com/shops/${shopID}`);
                fetchShops();
            } catch (error) {
                console.error("Error deleting shop:", error);
            }
        }
    };

    return (
      <>
      <EmployeeHeader />
        <div className="container">
            <h1>Shop Management</h1>
            <button className="create-button" onClick={() => openModal()}>
                Add Shop
            </button>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Shop Name</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shops.map((shop) => (
                        <tr key={shop.shopID}>
                            <td>{shop.shopName}</td>
                            <td>{shop.location}</td>
                            <td>{shop.shopType === 0 ? "Restaurant" : "Gift Shop"}</td>
                            <td>{shop.shopDesc}</td>
                            <td>
                                <img
                                    src={`/images/${shop.imageFileName}`}
                                    alt={shop.shopName}
                                    className="shop-image"
                                />
                            </td>
                            <td>
                                <button onClick={() => openModal(shop)} className="edit-button">Edit</button>
                                <button onClick={() => handleDelete(shop.shopID)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Shop Modal"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>{isEditMode ? "Edit Shop" : "Add Shop"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Shop Name:
                        <input
                            type="text"
                            name="shopName"
                            value={formData.shopName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Location:
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Shop Type:
                        <select
                            name="shopType"
                            value={formData.shopType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value={0}>Restaurant</option>
                            <option value={1}>Gift Shop</option>
                        </select>
                    </label>
                    <label>
                        Description:
                        <textarea
                            name="shopDesc"
                            value={formData.shopDesc}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <button type="submit">{isEditMode ? "Update" : "Add"} Shop</button>
                    <button type="button" onClick={closeModal}>
                        Cancel
                    </button>
                </form>
            </Modal>
        </div>
        </>
    );
};

export default GiftShopForm;