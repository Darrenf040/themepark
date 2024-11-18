import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Modal from "./Modal";
import "./DataEntryForm.css";
import "./DataForm.css";
import EmployeeHeader from "../components/employeeHeader";

const API_URL = "http://localhost:3000/events";

function SpecialEventForm() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    eventType: "",
    startDate: "",
    endDate: "",
    imageFileName: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/read`);
      setEvents(response.data.result);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const onDrop = (acceptedFiles) => {
    setImageFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleCreateEvent = async () => {
    try {
      await axios.post(`${API_URL}/create`, newEvent);
      fetchEvents();
      setCreateModalOpen(false);
      setNewEvent({
        eventName: "",
        eventType: "",
        startDate: "",
        endDate: "",
        imageFileName: "",
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleEditEvent = (event) => {
    if (event === undefined) {
      return;
    }
    // Format the date values properly for datetime-local input
    const formattedStartDate = formatForDateLocal(event.startDate);
    const formattedEndDate = formatForDateLocal(event.endDate);

    setEditingEvent({
      ...event,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    setEditModalOpen(true);
  };

  const handleUpdateEvent = async () => {
    try {
      await axios.put(`${API_URL}/${editingEvent.eventID}`, editingEvent);
      fetchEvents();
      setEditModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Format the DATETIME string to dd-MMM-yyyy format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("en-TX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatForDateLocal = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 10); // Get the first 16 characters to match datetime-local format
  };

  const handleDeleteEvent = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmDelete) {
      try {
        axios.delete(`${API_URL}/${id}`);
        setTimeout(() => {
                console.log("after 2 seconds"); 
              }, 2000);
        fetchEvents(); // Re-fetch events after deletion
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <>
      <EmployeeHeader />
      <div className="container">
        <h1>Event Management</h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="create-button"
        >
          Create Event
        </button>

        <table className="data-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Event Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events &&
              events.map((event, key) => {
                return (
                  <tr key={key}>
                    <td>{event.eventName}</td>
                    <td>{event.eventType}</td>
                    <td>{formatDate(event.startDate)}</td>
                    <td>{formatDate(event.endDate)}</td>
                    <td>
                      {event.imageFileName ? (
                        <img
                          src={`/images/${event.imageFileName}`}
                          alt={event.eventName}
                          width="50"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.eventID)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Create Event Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
        >
          <h2>Create Event</h2>
          <input
            type="text"
            name="eventName"
            value={newEvent.eventName}
            onChange={handleInputChange}
            placeholder="Event Name"
          />
          <select
            type="text"
            name="eventType"
            value={newEvent.eventType}
            onChange={handleInputChange}
            placeholder="Event Type"
          >
            <option value="">Select Event Type</option>
            <option value="Holiday">Holiday</option>
            <option value="Festival">Festival</option>
            <option value="Seasonal">Seasonal</option>
            <option value="Fireworks">Fireworks</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={newEvent.startDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="endDate"
            value={newEvent.endDate}
            onChange={handleInputChange}
          />

          <button onClick={handleCreateEvent} className="create-button">
            Create
          </button>
        </Modal>

        {/* Edit Event Modal */}
        <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <h2>Edit Event</h2>
          <input
            type="text"
            name="eventName"
            value={editingEvent?.eventName || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, eventName: e.target.value })
            }
          />
          <select
            type="text"
            name="eventType"
            value={editingEvent?.eventType || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, eventType: e.target.value })
            }
          >
            <option value="">Select Event Type</option>
            <option value="Holiday">Holiday</option>
            <option value="Festival">Festival</option>
            <option value="Seasonal">Seasonal</option>
            <option value="Fireworks">Fireworks</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={editingEvent?.startDate || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, startDate: e.target.value })
            }
          />
          <input
            type="date"
            name="endDate"
            value={editingEvent?.endDate || ""}
            onChange={(e) =>
              setEditingEvent({ ...editingEvent, endDate: e.target.value })
            }
          />
          <button onClick={handleUpdateEvent} className="update-button">
            Update
          </button>
        </Modal>
      </div>
    </>
  );
}

export default SpecialEventForm;

/*<div {...getRootProps()} className="dropzone">
<input {...getInputProps()} />
{imageFile ? (
<p>{imageFile.name}</p>
) : (
<p>Drag or select an image</p>
)}
</div> */
