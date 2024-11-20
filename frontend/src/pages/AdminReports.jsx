import { useState } from "react";
import AdminHeader from "../components/adminHeader.jsx";
import axios from "axios";
import "./adminReports.css";

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState("maintenance"); // Track the active section
  const [filterDate, setFilterDate] = useState({});
  const [rideMaint, setRideMaint] = useState([]);
  const [ticketDate, setticketDate] = useState({});
  const [filtertickets, setFiltertickets] = useState([]);
  const [refundDate, setrefundDate] = useState({});
  const [filterrefund, setFilterrefund] = useState([]);

  const postmMintenance = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://themepark-backend.onrender.com/reports/maintenance",
        filterDate
      )
      .then((res) => {
        setRideMaint(res.data.Result);
      })
      .catch((err) => alert(err));
  };

  const ticketSales = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://themepark-backend.onrender.com/reports/ticket-sales",
        ticketDate
      )
      .then((res) => setFiltertickets(res.data.Result))
      .catch((err) => alert(err));
  };

  const refund = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://themepark-backend.onrender.com/reports/refund-info",
        refundDate
      )
      .then((res) => {
        setFilterrefund(res.data.Result);
      })
      .catch((err) => alert(err));
  };

  return (
    <>
      <AdminHeader />
      <div className="reports-container">
        <div className="tabs-container" style={{ marginBottom: "20px" }}>
          <button
            style={{ marginRight: "10px" }}
            onClick={() => setActiveTab("maintenance")}
          >
            Maintenance Schedule
          </button>
          <button
            style={{ marginRight: "10px" }}
            onClick={() => setActiveTab("tickets")}
          >
            Ticket Sales
          </button>
          <button onClick={() => setActiveTab("refunds")}>
            Cancelled Tickets
          </button>
        </div>

        {/* Maintenance Schedule */}
        {activeTab === "maintenance" && (
          <>
            <h1>Maintenance Schedule</h1>
            <form onSubmit={postmMintenance}>
              <label htmlFor="rideName">Filter by Ride Name</label>
              <select
                id="rideName"
                onChange={(e) =>
                  setFilterDate({ ...filterDate, rideName: e.target.value })
                }
              >
                <option value="">All Rides</option>
                {Array.from(
                  new Set(rideMaint.map((ride) => ride.rideName))
                ).map((rideName, index) => (
                  <option key={index} value={rideName}>
                    {rideName}
                  </option>
                ))}
              </select>
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                onChange={(e) =>
                  setFilterDate({ ...filterDate, startDate: e.target.value })
                }
              />

              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                onChange={(e) =>
                  setFilterDate({ ...filterDate, endDate: e.target.value })
                }
              />
              <button type="submit">Generate</button>
            </form>
            <table>
              <thead>
                <tr>
                  <th>RideID</th>
                  <th>Ride Name</th>
                  <th>Status</th>
                  <th>Open Date</th>
                  <th>Close Date</th>
                  <th>Technician First Name</th>
                  <th>Technician Last Name</th>
                </tr>
              </thead>
              <tbody>
                {rideMaint
                  .filter((ride) =>
                    filterDate.rideName
                      ? ride.rideName === filterDate.rideName
                      : true
                  )
                  .map((ride, key) => (
                    <tr key={key}>
                      <td>{ride.rideID}</td>
                      <td>{ride.rideName}</td>
                      <td>
                        {{
                          0: "Incomplete",
                          1: "Complete",
                          2: "Event Maintenance",
                          3: "Requires Rescheduling",
                          4: "Cancelled",
                        }[ride.maintenanceStatus] || "Unknown"}
                      </td>
                      <td>
                        {
                          new Date(ride.maintenanceOpenDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td>
                        {
                          new Date(ride.maintenanceCloseDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td>{ride.Fname}</td>
                      <td>{ride.Lname}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Total Occurrence:
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {
                      rideMaint.filter((ride) =>
                        filterDate.rideName
                          ? ride.rideName === filterDate.rideName
                          : true
                      ).length
                    }
                  </td>
                </tr>
              </tfoot>
            </table>
          </>
        )}

        {/* Ticket Sales */}
        {activeTab === "tickets" && (
          <>
            <h1>Ticket Sales</h1>
            <form onSubmit={ticketSales}>
              <label htmlFor="ticketName">Ticket Type</label>
              <select
                id="ticketName"
                onChange={(e) => {
                  setticketDate({ ...ticketDate, ticketName: e.target.value });
                }}
              >
                <option value="" disabled selected>
                  Select a ticket type
                </option>
                <option value="Adult">Adult</option>
                <option value="Senior">Senior</option>
                <option value="Child">Child</option>
              </select>
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                onChange={(e) =>
                  setticketDate({ ...ticketDate, startDate: e.target.value })
                }
              />
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                onChange={(e) =>
                  setticketDate({ ...ticketDate, expiryDate: e.target.value })
                }
              />
              <button type="submit">Generate</button>
            </form>
            <table>
              <thead>
                <tr>
                  <th>Number of Tickets</th>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>Expire Date</th>
                  <th>Total Ticket Sales</th>
                </tr>
              </thead>
              <tbody>
                {filtertickets.map((ticket, key) => (
                  <tr key={key}>
                    <td>{ticket.ticketCount}</td>
                    <td>{ticket.ticketName}</td>
                    <td>
                      {new Date(ticket.startDate).toISOString().split("T")[0]}
                    </td>
                    <td>
                      {new Date(ticket.expiryDate).toISOString().split("T")[0]}
                    </td>
                    <td>{ticket.totalTicketPrice}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Total Sales:
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {filtertickets.reduce(
                      (acc, ticket) => acc + (ticket.totalTicketPrice || 0),
                      0
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </>
        )}

        {/* Cancelled Tickets */}
        {activeTab === "refunds" && (
          <>
            <h1>Cancelled Tickets</h1>
            <form onSubmit={refund}>
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                onChange={(e) =>
                  setrefundDate({ ...refundDate, startDate: e.target.value })
                }
              />
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                onChange={(e) =>
                  setrefundDate({ ...refundDate, expiryDate: e.target.value })
                }
              />
              <button type="submit">Generate</button>
            </form>
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Type</th>
                  <th>Customer ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Start Date</th>
                  <th>Expire Date</th>
                </tr>
              </thead>
              <tbody>
                {filterrefund &&
                  filterrefund.map((refund, key) => (
                    <tr key={key}>
                      <td>{refund.ticketID}</td>
                      <td>{refund.ticketName}</td>
                      <td>{refund.customerID}</td>
                      <td>{refund.Fname}</td>
                      <td>{refund.Lname}</td>
                      <td>{refund.phoneNumber}</td>
                      <td>{refund.Email}</td>
                      <td>
                        {new Date(refund.startDate).toISOString().split("T")[0]}
                      </td>
                      <td>
                        {
                          new Date(refund.expiryDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Total Tickets Cancelled:
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {filterrefund ? filterrefund.length : 0}
                  </td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>
      {/* Tab Navigation */}
    </>
  );
}
