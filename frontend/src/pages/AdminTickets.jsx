import axios from "axios";
import AdminHeader from "../components/adminHeader";
import { useEffect, useState } from "react";
import TicketCard from "../components/ticketCard";

export default function AdminTickets() {
  const [ticketList, setTicketList] = useState([]);
  const [customerSearchInfo, setCustomerSearchInfo] = useState({});
  const getTickets = () => {
    axios
      .get("https://themepark-backend.onrender.com//adminTickets/retrieveAll")
      .then((res) => setTicketList(res.data.Result))
      .catch((err) => alert(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://themepark-backend.onrender.com//adminTickets/filterCustomer",
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
  }, []);
  return (
    <>
      <AdminHeader />
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
              />
            </>
          );
        })}
    </>
  );
}
