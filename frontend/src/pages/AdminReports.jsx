import { useState } from "react";
import AdminHeader from "../components/adminHeader.jsx";
import axios from "axios";

export default function AdminReports(){
  const [filterDate, setFilterDate] = useState({})
  const [rideMaint, setRideMaint] = useState([])
  const [shopData, setShopData] = useState({})
  const [filterShops, setFilterShops] = useState([])
  const [ticketDate, setticketDate] = useState({})
  const [filtertickets, setFiltertickets] = useState([])
  const [refundDate, setrefundDate] = useState({})
  const [filterrefund, setFilterrefund] = useState([])

  

const  postmMintenance =  (e) => {

  e.preventDefault();
   setRideMaint([{...rideMaint, maintenanceOpenDate: new Date(filterDate.startDate).toISOString().split('T')[0], // YYYY-MM-DD
    maintenanceCloseDate: new Date(filterDate.endDate).toISOString().split('T')[0],     // YYYY-MM-DD
  }]);
  axios.post("http://localhost:3000/reports/maintenance", filterDate)
  .then(res =>{
    setRideMaint(res.data.Result)
  })
  .catch(err => alert(err))
  console.log(rideMaint)

}

const  transaction =  (e) => {

  e.preventDefault();
  axios.post("http://localhost:3000/reports/shop-transactions",shopData)
  .then(res => setFilterShops(res.data.Result))
  .catch(err => alert(err))
}
const  ticketSales =  (e) => {

  e.preventDefault();
  axios.post("http://localhost:3000/reports/ticket-sales",ticketDate)
  .then(res => setFiltertickets(res.data.Result))
  .catch(err => alert(err))
}

const  refund =  (e) => {

  e.preventDefault();
  axios.post("http://localhost:3000/reports/refund-info", refundDate)
  .then(res =>setFilterrefund(res.data.Result))
  .catch(err => alert(err))
  console.log(filterrefund)
}

  return(
    <>
    <AdminHeader />
    <h1>Maintenance Schedule</h1>
    <form action="" onSubmit={postmMintenance} >
      <label htmlFor="startDate">Start Date</label>
      <input type="date" onChange={(e) => setFilterDate({...filterDate, startDate: e.target.value})} />

      <label htmlFor="endDate">End Date</label>
      <input type="date" onChange={(e) => setFilterDate({...filterDate, endDate: e.target.value})} />
      <button type="submit">Generate</button>
    </form>
    <table>
      <tr>
        <th>RideID</th>
        <th>Ride Name</th>
        <th>Status</th>
        <th>Open Date</th>
        <th>Close Date</th>
        <th>Technician First Name</th>
        <th>Technician Last Name</th>
      </tr>

       {rideMaint &&
        rideMaint.map((ride, key) => {
          return (
            <>
              <tr>
                <td>{ride.rideID}</td>
                <td>{ride.rideName}</td>
                <td>{ride.maintenanceStatus}</td>
                <td>{new Date(ride.maintenanceOpenDate).toISOString().split('T')[0]}</td>
                <td>{new Date(ride.maintenanceCloseDate).toISOString().split('T')[0]}</td>
                <td>{ride.Fname}</td>
                <td>{ride.Lname}</td>


              </tr>
            </>
          );
        })}

        </table>
    <h1>Shops Sales</h1>
    <form action="" onSubmit={transaction} >
    <label htmlFor="shopName">Shop Name</label>
      <select name="" id="" onChange={(e) => setShopData({...shopData, shopName: e.target.value})}>
        <option selected disabled value="">Select a ride</option>
        <option value="Desserts ThemeRestaurant">Desserts ThemeRestaurant</option>
        <option value="Themepark Gifts">Themepark Gifts</option>
        <option value="Themepark Convenience">Themepark Convenience</option>
        <option value="Themepark Collectables">Themepark Collectables</option>
        <option value="Tacos ThemeRestaurant">Tacos ThemeRestaurant</option>
        <option value="Pasta ThemeRestaurant">Pasta ThemeRestaurant</option>
        <option value="Sandwiches ThemeRestaurant">Sandwiches ThemeRestaurant</option>
        <option value="Themepark Family Gifts">Themepark Family Gifts</option>
        <option value="Seafood ThemeRestaurant">Seafood ThemeRestaurant</option>
        <option value="Themepark Apparel">Themepark Apparel</option>
      </select>

      <label htmlFor="startDate">Start Date</label>
      <input type="date" onChange={(e) => setShopData({...shopData, startDate: e.target.value})} />

      <label htmlFor="endDate">End Date</label>
      <input type="date" onChange={(e) => setShopData({...shopData, endDate: e.target.value})} />
      <button type="submit">Generate</button>
    </form>
    <table>
      <tr>
        <th>Name</th>
        <th>id</th>
        <th>location</th>
        <th>Date</th>
        <th>total</th>
      </tr>
      {filterShops && filterShops.map((shop, key) => {
        return(
          <>
          <tr>
            <td>{shop.shopName}</td>
            <td>{shop.shopID}</td>
            <td>{shop.location}</td>
            <td>{new Date(shop.transactionDate).toISOString().split('T')[0]}</td>
            <td>{shop.totalTransactionAmount}</td>

          </tr>
          </>
        )
      })}
    </table>
    <h1>Ticket Sale</h1>
    <form action="" onSubmit={ticketSales} >
    <label htmlFor="ticketName">Ticket Type</label>
      <select name="" id="" onChange={(e) => {
        setticketDate({...ticketDate, ticketName: e.target.value})
        console.log(e.target.value)
      }}>
        <option selected disabled value="">Select a ticket type</option>
        <option value="Adult">Adult</option>
        <option value="Senior">Senior</option>
        <option value="Child">Child</option>
      </select>

      <label htmlFor="startDate">Start Date</label>
      <input type="date" onChange={(e) => setticketDate({...ticketDate, startDate: e.target.value})} />

      <label htmlFor="expiryDate">Expire Date</label>
      <input type="date" onChange={(e) => setticketDate({...ticketDate, expiryDate: e.target.value})} />
      <button type="submit">Generate</button>
    </form>

    <table>
      <tr>
        <th>IDs</th>
        <th>Type</th>
        <th>Name</th>
        <th>Start Date</th>
        <th>Expire Date</th>
        <th>Total Ticket Sales</th>
      </tr>
      {filtertickets && filtertickets.map((ticket, key) => {
        return(
          <>
          <tr>
            <td>{ticket.ticketIDs}</td>
            <td>{ticket.ticketType}</td>
            <td>{ticket.ticketName}</td>
            <td>{new Date(ticket.startDate).toISOString().split('T')[0]}</td>
            <td>{new Date(ticket.expiryDate).toISOString().split('T')[0]}</td>
            <td>{ticket.totalTicketPrice}</td>

          </tr>
          </>
        )
      })}
    </table>
    <h1>Canceled Ticket</h1>
    <form action="" onSubmit={refund} >
      <label htmlFor="startDate">Start Date</label>
      <input type="date" onChange={(e) => setrefundDate({...refundDate, startDate: e.target.value})} />

      <label htmlFor="expiryDate">Expire Date</label>
      <input type="date" onChange={(e) => setrefundDate({...refundDate, expiryDate: e.target.value})} />
      <button type="submit">Generate</button>
    </form>
    <table>
      <tr>
        <th>ticketID</th>
        <th>Type</th>
        <th>Customer ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Phone Number</th>
        <th>Email</th>
        <th>Start Date</th>
        <th>Expire Date</th>
      </tr>
      {filterrefund &&
        filterrefund.map((refund, key) => {
          return (
            <>
              <tr>
                <td>{refund.ticketID}</td>
                <td>{refund.ticketName}</td>
                <td>{refund.customerID}</td>
                <td>{refund.Fname}</td>
                <td>{refund.Lname}</td>
                <td>{refund.phoneNumber}</td>
                <td>{refund.Email}</td>
                <td>{new Date(refund.startDate).toISOString().split('T')[0]}</td>
                <td>{new Date(refund.expiryDate).toISOString().split('T')[0]}</td>

              </tr>
            </>
          );
        })}

        </table>

    </>
    
  )
}