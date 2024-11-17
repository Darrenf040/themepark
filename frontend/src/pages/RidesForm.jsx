import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // Assuming the same Modal component is used
import axios from "axios";
import "./DataForm.css";
import EmployeeHeader from "../components/employeeHeader";

const API_URL = "https://gleaming-lokum-158537.netlify.app/rides";

const RidesForm = () => {
    const [rides, setRides] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingRide, setEditingRide] = useState(null);
    const [employees, setEmployees] = useState([]);

    const fetchEmployees = async () => {
      try {
          const response = await axios.get("https://gleaming-lokum-158537.netlify.app/employee/read");
          setEmployees(response.data.result);
      } catch (error) {
          console.error("Error fetching employees:", error);
      }
    };



    // Fetch rides from the API
    const fetchRides = async () => {
        try {
            const response = await axios.get(`${API_URL}/read`);
            setRides(response.data.result);
        } catch (error) {
            console.error("Error fetching rides:", error);
        }
    };

    useEffect(() => {
        fetchRides();
        fetchEmployees();
    }, []);

    // Open Modal for Add/Edit
    const openModal = (ride = null) => {
        if (ride) {
            setEditingRide({
                ...ride,
                openingTime: ride.openingTime,
                closingTime: ride.closingTime,
            });
        } else {
            setEditingRide({
                rideName: "",
                capacity: "",
                openingTime: "",
                closingTime: "",
                technician: "",
                rideType: "",
                rideDesc: "",
                imageFileName: "",
            });
        }
        setModalOpen(true);
    };

    // Handle Save (Add or Update)
    const handleSaveRide = async () => {
        try {
            if (editingRide.rideID) {
                // Update existing ride
                await axios.put(`${API_URL}/${editingRide.rideID}`, editingRide);
            } else {
                // Create new ride
                await axios.post(`${API_URL}/create`, editingRide);
            }
            setModalOpen(false);
            fetchRides();
        } catch (error) {
            console.error("Error saving ride:", error);
        }
    };

    // Handle Delete
    const handleDeleteRide = async (rideID) => {
        if (window.confirm("Are you sure you want to delete this ride?")) {
            try {
                await axios.delete(`${API_URL}/${rideID}`);
                fetchRides();
            } catch (error) {
                console.error("Error deleting ride:", error);
            }
        }
    };

    return (
      <>
      <EmployeeHeader />
        <div className="container">
            <h1>Ride Management</h1>
            <button onClick={() => openModal()} className="create-button">
                Add New Ride
            </button>

            {/* Table for Ride List */}
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Ride Name</th>
                        <th>Capacity</th>
                        <th>Opening Time</th>
                        <th>Closing Time</th>
                        <th>Technician</th>
                        <th>Ride Type</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rides.map((ride) => (
                        <tr key={ride.rideID}>
                            <td>{ride.rideName}</td>
                            <td>{ride.capacity}</td>
                            <td>{ride.openingTime}</td>
                            <td>{ride.closingTime}</td>
                            <td>{ride.technician}</td>
                            <td>{ride.rideType}</td>
                            <td>{ride.rideDesc}</td>
                            <td>
                                {ride.imageFileName ? (
                                    <img
                                        src={`/public/images/${ride.imageFileName}`}
                                        alt={ride.rideName}
                                        width="50"
                                    />
                                ) : (
                                    "No Image"
                                )}
                            </td>
                            <td>
                                <button onClick={() => openModal(ride)} class="edit-button">Edit</button>
                                <button onClick={() => handleDeleteRide(ride.rideID)} class="delete-button">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Component for Add/Edit */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <h2>{editingRide?.rideID ? "Edit Ride" : "Add Ride"}</h2>
                    <input
                        type="text"
                        placeholder="Ride Name"
                        value={editingRide.rideName}
                        onChange={(e) =>
                            setEditingRide({ ...editingRide, rideName: e.target.value })
                        }
                    />
                    <input
                        type="number"
                        placeholder="Capacity"
                        value={editingRide.capacity}
                        onChange={(e) =>
                            setEditingRide({ ...editingRide, capacity: e.target.value })
                        }
                    />
                    <input
                        type="time"
                        value={editingRide.openingTime}
                        onChange={(e) =>
                            setEditingRide({ ...editingRide, openingTime: e.target.value })
                        }
                    />
                    <input
                        type="time"
                        value={editingRide.closingTime}
                        onChange={(e) =>
                            setEditingRide({ ...editingRide, closingTime: e.target.value })
                        }
                    />
                    <select
                        value={editingRide.technician}
                        onChange={(e) =>
                            setEditingRide({ ...editingRide, technician: e.target.value })
                        }
                    >
                        <option value="">Select Technician</option>
                        {employees.map((employee) => (
                            <option key={employee.Ssn} value={employee.Ssn}>
                                {employee.Fname} {employee.Lname}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Ride Type"
                        value={editingRide.rideType}
                        onChange={(e) =>
                            setEditingRide({ ...editingRide, rideType: e.target.value })
                        }
                    />
                    <textarea
                        placeholder="Description"
                        value={editingRide.rideDesc}
                        rows={4} cols={65}
                        onChange={(e) =>
                            setEditingRide({ ...editingRide, rideDesc: e.target.value })
                        }
                    ></textarea>
                    <button onClick={handleSaveRide} class="create-button">
                        {editingRide?.rideID ? "Update" : "Create"}
                    </button>
                </Modal>
            )}
        </div>
        </>
    );
};

export default RidesForm;
