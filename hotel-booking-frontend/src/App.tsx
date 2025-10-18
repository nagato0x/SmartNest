import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "./components/ui/toaster";

import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel"; // Will serve as "Add Boarding"
import MyHotels from "./pages/MyHotels"; // Will serve as "My Boardings"
import EditHotel from "./pages/EditHotel"; // "Edit Boarding"
import Search from "./pages/Search";
import Detail from "./pages/Detail"; // Boarding details
import Booking from "./pages/Booking"; // Booking a boarding
import MyBookings from "./pages/MyBookings"; // My reservations
import Home from "./pages/Home";
import ApiDocs from "./pages/ApiDocs";
import ApiStatus from "./pages/ApiStatus";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import useAppContext from "./hooks/useAppContext";

const App = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/search" element={<Layout><Search /></Layout>} />
        <Route path="/detail/:hotelId" element={<Layout><Detail /></Layout>} />
        <Route path="/api-docs" element={<Layout><ApiDocs /></Layout>} />
        <Route path="/api-status" element={<Layout><ApiStatus /></Layout>} />
        <Route path="/analytics" element={<Layout><AnalyticsDashboard /></Layout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/sign-in" element={<AuthLayout><SignIn /></AuthLayout>} />

        {/* Authenticated user routes */}
        {isLoggedIn && (
          <>
            {/* Booking a boarding */}
            <Route path="/hotel/:hotelId/booking" element={<Layout><Booking /></Layout>} />

            {/* Add / Edit / View my boardings */}
            <Route path="/add-hotel" element={<Layout><AddHotel /></Layout>} />
            <Route path="/edit-hotel/:hotelId" element={<Layout><EditHotel /></Layout>} />
            <Route path="/my-hotels" element={<Layout><MyHotels /></Layout>} />
            <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />
          </>
        )}

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
