import axios from "axios";
import AdminHeader from "../components/adminHeader";
import { useEffect, useState } from "react";
import TicketCard from "../components/ticketCard";
import "./adminTickets.css";

export default function AdminTickets() {
  const [ticketList, setTicketList] = useState([]);
  const [ticketAvailibility, setTicketAvailibility] = useState([]);
  const [customerSearchInfo, setCustomerSearchInfo] = useState({});
  const [parkDays, setParkDays] = useState([]);
  const [parkDayFilter, setParkDayFilter] = useState({});
  const getTickets = () => {
    axios
      .get("http://localhost:3000/adminTickets/retrieveAll")
      .then((res) => setTicketList(res.data.Result))
      .catch((err) => alert(err));
  };
  const getCustomerTicketDetails = (e) => {
    e.preventDefault();
    const customerTicketData = {
      customerID: e.target.parentNode.dataset.id,
      ticketType: e.target.parentNode.dataset.tickettype,
    };
    console.log(customerTicketData);
    axios
      .post(
        "http://localhost:3000/adminTickets/customer",
        customerTicketData
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };
  const getTicketAvailibility = () => {
    axios
      .get("http://localhost:3000/adminTickets/availibility", {
        params: parkDayFilter,
      })
      .then((res) => setTicketAvailibility(res.data.Response))
      .catch((err) => alert(err));
  };
  const getVisitDays = () => {
    axios
      .get("http://localhost:3000/adminTickets/days")
      .then((res) => setParkDays(res.data.Response))
      .catch((err) => alert(err));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3000/adminTickets/filterCustomer",
        customerSearchInfo
      )
      .then((res) => {
        setTicketList(res.data.Result);
        alert(`${res.data.Result.firstName} Details displayed`);
      })
      .catch((err) => alert(err));
  };
  useEffect(() => {
    getTickets();
    getTicketAvailibility();
    getVisitDays();
  }, [parkDayFilter]);
  return (
    <>
      <AdminHeader />
      <section>
        <div className="ticket-report-container">
          <h1>Ticket Availabilty</h1>
          <div>
            <label htmlFor="operatingDay">Operating Day</label>
            <select
              name=""
              id="operatingDay"
              onChange={(e) =>
                setParkDayFilter({ ...parkDayFilter, date: e.target.value })
              }
            >
              <option value="" disabled selected>
                Choose Park Operating Day
              </option>
              {parkDays &&
                parkDays.map((day) => {
                  return (
                    <>
                      <option value={day.Date}>{day.Date}</option>
                    </>
                  );
                })}
            </select>
          </div>
          <table>
            <tr>
              <th>Date</th>
              <th>Capacity</th>
              <th>Visits</th>
              <th>Tickets</th>
            </tr>
            {ticketAvailibility &&
              parkDayFilter &&
              ticketAvailibility.map((day) => {
                console.log(day);
                return (
                  <>
                    <tr>
                      <td>{day.Date}</td>
                      <td>{day.TotalCapacity}</td>
                      <td>{day.TotalVisits}</td>
                      <td>{day.RemainingCapacity}</td>
                    </tr>
                  </>
                );
              })}
          </table>
        </div>

        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="Fname">First Name</label>
          <input
            type="text"
            id="Fname"
            onChange={(e) =>
              setCustomerSearchInfo({
                ...customerSearchInfo,
                firstName: e.target.value,
              })
            }
          />

          <label htmlFor="Lname">Last Name</label>
          <input
            type="text"
            id="Lname"
            onChange={(e) =>
              setCustomerSearchInfo({
                ...customerSearchInfo,
                lastName: e.target.value,
              })
            }
          />
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            onChange={(e) =>
              setCustomerSearchInfo({
                ...customerSearchInfo,
                phoneNumber: e.target.value,
              })
            }
          />
          <button type="submit">search</button>
        </form>
        {ticketList &&
          ticketList.map((ticket, key) => {
            let ticketType = "";
            if (ticket.ticketType == 0) {
              ticketType = "Child";
            } else if (ticket.ticketType == 1) {
              ticketType = "Adult";
            } else {
              ticketType = "Senior";
            }
            return (
              <>
                <TicketCard
                  customerID={ticket.customerID}
                  Fname={ticket.Fname}
                  Lname={ticket.Lname}
                  phoneNumber={ticket.phoneNumber}
                  ticketType={ticketType}
                  ticketCount={ticket.ticketCount}
                  key={key}
                  dataCustomerID={ticket.customerID}
                  dataCustomerTicketType={ticket.ticketType}
                  onClick={getCustomerTicketDetails}
                />
              </>
            );
          })}
      </section>
    </>
  );
}
