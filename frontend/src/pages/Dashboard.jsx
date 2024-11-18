import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import Modal from "./Modal";
import 'react-calendar/dist/Calendar.css';
import "./Dashboard.css";
import "./DataForm.css";
import EmployeeHeader from "../components/employeeHeader";

const Dashboard = () => {
    const [topRides, setTopRides] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
    const [editingMaint, setEditingMaint] = useState([null]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dayEvents, setDayEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

   
        // Fetch top 5 popular rides
        const fetchTopRides = async () => {
            try {
                const response = await axios.get("http://localhost:3000rides/top-rides");
                setTopRides(response.data.result);
            } catch (error) {
                console.error("Error fetching top rides:", error);
            }
        };

        // Fetch top 5 upcoming events
        const fetchUpcomingEvents = async () => {
            try {
                const response = await axios.get("http://localhost:3000events/upcoming-events");
                setUpcomingEvents(response.data.result);
            } catch (error) {
                console.error("Error fetching upcoming events:", error);
            }
        };

        // Fetch top 5 upcoming maintenance
        const fetchUpcomingMaintenance = async () => {
            try {
                const response = await axios.get("http://localhost:3000events/upcoming-maintenance");
                setUpcomingMaintenance(response.data.result);
            } catch (error) {
                console.error("Error fetching upcoming maintenance:", error);
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:3000events/read");
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

    const openModal = (maintenance = null) => {
        if (maintenance) {
            setEditingMaint({
                ...maintenance,
                maintenanceOpenDate: maintenance.maintenanceOpenDate,
            });
        } else {
            setEditingMaint({
                maintenanceOpenDate: "",
                maintenanceStatus: "",
            });
        }
        setEditModalOpen(true);
    };

    // Handle date selection
    const handleDateChange = (date) => {
        if(date === undefined)  {
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
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        };
      
        const formatForDateLocal = (dateStr) => {
            const date = new Date(dateStr);
            return date.toISOString().slice(0, 10); // Get the first 16 characters to match datetime-local format
        };

    ///
    const handleEditMaint = (maintenance) => {
        if(maintenance === undefined) {
            return;
        }
      // Format the date values properly for datetime-local input
      /*const formattedOpenDate = formatForDateLocal(maintenance.maintenanceOpenDate);
      
      setEditingMaint({
          ...maintenance,
          maintenanceOpenDate: formattedOpenDate,
      });*/
      setEditModalOpen(true);
  };

  const getMaintStatus = (maintenanceStatus) => {
    switch (maintenanceStatus) {
      case 0:
        return "Incomplete";
      case 1:
        return "Complete";
      case 2:
        return "Event Maintenance";
      case 3:
        return "Requires Rescheduling"
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

    const handleUpdateMaint = async () => {
        try {
            await axios.put(`http://localhost:3000maintenance/${editingMaint.maintenanceID}`, editingMaint);
            fetchEvents();
            setEditModalOpen(false);
            setEditingMaint(null);
        } catch (error) {
            console.error("Error updating maintenance:", error);
        }
    };
    ///


    // Add custom styles for dates with events
    const tileContent = ({ date, view }) => {
        if(date === undefined || view === undefined)  {
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
                                {topRides && topRides.map((ride, key) => {
                                    return(
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
                                {upcomingEvents && upcomingEvents.map((event, key) => {
                                    return(
                                    <tr key={key}>
                                        <td>{event.eventName}</td>
                                        <td>{event.eventType}</td>
                                        <td>{new Date(event.startDate).toDateString()}</td>
                                        <td>{new Date(event.endDate).toDateString()}</td>
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
                                {dayEvents && dayEvents.map((event, key) => {
                                    return(
                                    <li key={key}>
                                        <strong>{event.eventName}</strong> - {event.eventType} <br />
                                        From: {new Date(event.startDate).toDateString()} <br />
                                        To: {new Date(event.endDate).toDateString()}
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
                                {upcomingMaintenance && upcomingMaintenance.map((maintenance, key) => {
                                    return(
                                    <tr key={key}>
                                        <td>{maintenance.rideName}</td>
                                        <td>{maintenance.technician}</td>
                                        <td>{new Date(maintenance.maintenanceDate).toDateString()}</td>
                                        <td style={getMaintStyle(maintenance.status)}>
                                            {getMaintStatus(maintenance.status)}</td>
                                        <td>
                                    <button onClick={() => handleEditMaint(maintenance)} className="edit-button">
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
                    <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
                    <h2>Edit Maintenance </h2>
                <input
                    type="date"
                    name="maintenance Date"
                    value={editingMaint?.maintenanceOpenDate || ""}
                    onChange={(e) => setEditingMaint({ ...editingMaint, maintenanceOpenDate: e.target.value })}
                />
                <select
                    type="text"
                    name="Maintenance Status"
                    value={editingMaint?.maintenanceStatus || ""}
                    onChange={(e) => setEditingMaint({ ...editingMaint, maintenanceStatus: e.target.value })}
                >
                    <option value="">Select Maintenance Status</option>
                    <option value="0">Incomplete</option>
                    <option value="1">Complete</option>
                    <option value="2">Event Maintenance</option>
                    <option value="4">Cancelled</option>
                    </select>
                <button onClick={handleUpdateMaint} className="update-button">Update</button>
            </Modal>
                </div>
            </div>
        </div>
        </>
    );
};

export default Dashboard;
