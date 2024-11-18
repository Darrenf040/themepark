import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminReports from "./pages/AdminReports.jsx";
// import AdminHome from "./pages/Home.jsx"; /*line to define adminhome reference */
import Dining from "./pages/Dining.jsx";
import Shops from "./pages/GiftShops.jsx";
import Events from "./pages/Events.jsx";
import Rides from "./pages/Rides.jsx";

import EmployeeHome from "./pages/Dashboard.jsx";
import AdminProtectedRoute from "./utils/AdminProtectedRoute.jsx";
import AdminEmployee from "./pages/AdminEmployee.jsx";
import AdminParkstatus from "./pages/AdminParkstatus.jsx";
import GiftShopForm from "./pages/GiftShopForm.jsx";
import TicketForm from "./pages/TicketForm.jsx";
import RideForm from "./pages/RidesForm.jsx";
import SpecialEventForm from "./pages/SpecialEventForm.jsx";
import EmployeeLogin from "./pages/EmployeeLogin.jsx";
import Login from "./pages/Login.jsx";
import AdminTickets from "./pages/AdminTickets.jsx";
import EmployeeProtectedRoute from "./utils/EmployeeProtectedRoute.jsx";
import { AuthProvider } from "./utils/AuthProvider.jsx";
import { CartProvider } from "./utils/CartContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import { TicketProvider } from "./utils/TicketContext.jsx";
import CustomerDetails from "./pages/CustomerDetails.jsx";
import CustomerLogin from "./pages/CustomerLogin.jsx";
import CustomerRegister from "./pages/CustomerRegister.jsx";
import ParkStatusForm from "./pages/AdminParkstatus.jsx";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <TicketProvider>
          <BrowserRouter>
            <Routes>
              {/*users can go to these pages without bening authenticated */}
              <Route element={<Home />} path="/" />
              <Route element={<Dining />} path="/dining" />
              <Route element={<Shops />} path="/giftshops" />
              <Route element={<Rides />} path="/rides" />
              <Route element={<Events />} path="/events" />
              <Route element={<AdminLogin />} path="/login/admin" />
              <Route element={<TicketForm />} path="/ticket" />
              <Route element={<EmployeeLogin />} path="/login/employee" />
              <Route element={<Login />} path="/login" />
              <Route element={<CustomerDetails />} path="/customer-account" />
              <Route element={<CustomerLogin />} path="/customer-login" />
              <Route element={<CustomerRegister />} path="/customer-register" />
              <Route element={<AdminProtectedRoute />}>
                <Route element={<AdminTickets />} path="/login/admin/tickets" />
                <Route element={<AdminReports />} path="/login/admin/reports" />
                <Route
                  element={<AdminEmployee />}
                  path="/login/admin/employees"
                />
                <Route
                  element={<AdminParkstatus />}
                  path="/login/admin/parkstatus"
                />
              </Route>
              <Route element={<EmployeeProtectedRoute />}>
                <Route
                  element={<Dashboard />}
                  path="/login/employees/dashboard"
                />
                <Route
                  element={<EmployeeHome />}
                  path="/login/employees/home"
                />
                <Route
                  element={<GiftShopForm />}
                  path="/login/employees/shop"
                />
                <Route
                  element={<SpecialEventForm />}
                  path="/login/employees/events"
                />
                <Route element={<RideForm />} path="/login/employees/ride" />
              </Route>
            </Routes>
          </BrowserRouter>
        </TicketProvider>
      </CartProvider>
    </AuthProvider>
  );
}
