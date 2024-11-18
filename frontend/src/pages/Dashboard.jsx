import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";
import "./DataForm.css";
import EmployeeHeader from "../components/employeeHeader";

const Dashboard = () => {
  const [topRides, setTopRides] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [editingMaint, setEditingMaint] = useState({
    maintenanceID: "",
    maintenanceOpenDate: "",
    maintenanceStatus: "",
});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayEvents, setDayEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // Fetch top 5 popular rides
  const fetchTopRides = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/rides/top-rides"
      );
      setTopRides(response.data.result);
    } catch (error) {
      console.error("Error fetching top rides:", error);
    }
  };

  // Fetch top 5 upcoming events
  const fetchUpcomingEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/events/upcoming-events"
      );
      setUpcomingEvents(response.data.result);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    }
  };

  // Fetch top 5 upcoming maintenance
  const fetchUpcomingMaintenance = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/events/upcoming-maintenance"
      );
      setUpcomingMaintenance(response.data.result);
    } catch (error) {
      console.error("Error fetching upcoming maintenance:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/events/read"
      );
      setEvents(response.data.result);
    } catch (error) {
      console.error("Error fetching upcoming maintenance:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchTopRides();
    fetchUpcomingEvents();
    fetchUpcomingMaintenance();
  }, []);

  // Handle date selection
  const handleDateChange = (date) => {
    if (date === undefined) {
      return;
    }
    setSelectedDate(date);
    const formattedDate = date.toISOString().split("T")[0];
    const filteredEvents = events.filter(
      (event) => event.startDate.split("T")[0] === formattedDate
    );
    setDayEvents(filteredEvents);
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

  const openModal = (maintenance) => {
    const formattedDate = formatForDateLocal(maintenance.maintenanceDate);
    setEditingMaint(
      {
          maintenanceID: maintenance.maintenanceID,
          maintenanceOpenDate: formattedDate,
          maintenanceStatus: maintenance.status,
      }
    );
    
    setEditModalOpen(true);
};

  const closeModal = () => setEditModalOpen(false);

  const getMaintStatus = (maintenanceStatus) => {
    switch (maintenanceStatus) {
      case 0:
        return "Incomplete";
      case 1:
        return "Complete";
      case 2:
        return "Event Maintenance";
      case 3:
        return "Requires Rescheduling";
      case 4: "Cancelled";
      default:
        return "Status not found";
    }
  };

  const getMaintStyle = (maintenanceStatus) => {
    if (maintenanceStatus === 3) {
      return { color: "red" };
    }
    return {};
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMaint({
        ...editingMaint,
        [name]: name === "maintenanceStatus" ? parseInt(value, 10) : value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    try {
      console.log(editingMaint.maintenanceOpenDate);
      console.log(editingMaint.maintenanceStatus);
      axios.put(`http://localhost:3000/maintenance/${editingMaint.maintenanceID}`, editingMaint);
      fetchUpcomingMaintenance();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating maintenance:", error);
    }
  };

  // Add custom styles for dates with events
  const tileContent = ({ date, view }) => {
    if (date === undefined || view === undefined) {
      return;
    }
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];
      const hasEvent = events.some(
        (event) => event.startDate.split("T")[0] === formattedDate
      );
      return hasEvent ? <div className="event-dot"></div> : null;
    }
  };

  return (
    <>
      <EmployeeHeader />
      <div className="dashboard-container">
        <div className="dashboard-row">
          {/* Top Rides */}
          <div className="dashboard-card">
            <h2>Top 5 Popular Rides</h2>
            {topRides ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Ride Name</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Popularity</th>
                  </tr>
                </thead>
                <tbody>
                  {topRides &&
                    topRides.map((ride, key) => {
                      return (
                        <tr key={key}>
                          <td>{ride.rideName}</td>
                          <td>{ride.rideType}</td>
                          <td>{ride.capacity}</td>
                          <td>{ride.popularityScore}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <p>No popular rides found.</p>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="dashboard-card">
            <h2>Top 5 Upcoming Events</h2>
            {upcomingEvents ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents &&
                    upcomingEvents.map((event, key) => {
                      return (
                        <tr key={key}>
                          <td>{event.eventName}</td>
                          <td>{event.eventType}</td>
                          <td>{formatDate(event.startDate)}</td>
                          <td>{formatDate(event.endDate)}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <p>No upcoming events found.</p>
            )}
          </div>
        </div>
        <div className="dashboard-row">
          {/* Event Calendar */}
          <div className="dashboard-card">
            <h2>Event Calendar</h2>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}
            />
            <div className="day-events">
              <h3>Events on {selectedDate.toDateString()}</h3>
              {dayEvents ? (
                <ul>
                  {dayEvents &&
                    dayEvents.map((event, key) => {
                      return (
                        <li key={key}>
                          <strong>{event.eventName}</strong> - {event.eventType}{" "}
                          <br />
                          From: {formatDate(event.startDate)}{" "}
                          <br />
                          To: {formatDate(event.endDate)}
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <p>No events scheduled for this day.</p>
              )}
            </div>
          </div>
          <div className="dashboard-card">
            <h2>Upcoming Maintenance</h2>
            {upcomingMaintenance ? (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Ride Name</th>
                    <th>Technician</th>
                    <th>Maintenance Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingMaintenance &&
                    upcomingMaintenance.map((maintenance) => {
                      return (
                        <tr key={maintenance.maintenanceID}>
                          <td>{maintenance.rideName}</td>
                          <td>{maintenance.technician}</td>
                          <td>
                            {formatDate(
                              maintenance.maintenanceDate
                            )}
                          </td>
                          <td style={getMaintStyle(maintenance.status)}>
                            {getMaintStatus(maintenance.status)}
                          </td>
                          <td>
                            <button
                              onClick={() => openModal(maintenance)}
                              className="edit-button"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <p>No upcoming maintenance found.</p>
            )}
            {/* Edit Maint Modal */}
            <Modal
              isOpen={isEditModalOpen}
              onRequestClose={closeModal}
              className="modal"
              overlayClassName="overlay"
            >
              <h2>Edit Maintenance </h2>
              {editingMaint && (<form onSubmit={handleUpdate}>
              <label>Date:
              <input
                type="date"
                name="maintenanceOpenDate"
                value={editingMaint.maintenanceOpenDate}
                onChange={handleInputChange}
                required
              />
              </label>
              <label>Maintenance Status:
              <select
                type="text"
                name="maintenanceStatus"
                value={editingMaint.maintenanceStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Maintenance Status</option>
                <option value="0">Incomplete</option>
                <option value="1">Complete</option>
                <option value="2">Event Maintenance</option>
                <option value="4">Cancelled</option>
              </select>
              </label>
              <button type="submit">Update Maintenance</button>
              <button type="button" onClick={closeModal}>
                        Cancel
                    </button>
              </form>
            )}
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
