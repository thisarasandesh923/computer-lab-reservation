
import "./App.css";

import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/home.jsx";
import Labs from "./pages/labs.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import MyReservations from "./pages/myReservations.jsx";
import CreateReservation from "./pages/createReservation.jsx";
import StaffDashboard from "./pages/staffDashboard.jsx";
import LabAvailability from "./pages/labAvailability.jsx";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={["representative"]} />}>
          <Route path="/labs" element={<Labs />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/reservations/new" element={<CreateReservation />} />
          <Route path="/availability" element={<LabAvailability />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "module_coordinator",
                "lab_coordinator",
                "instructor"
              ]}
            />
          }
        >
          <Route path="/staff" element={<StaffDashboard />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
