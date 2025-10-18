import { Link, useNavigate } from "react-router-dom";
import useAppContext from "../hooks/useAppContext";
import useSearchContext from "../hooks/useSearchContext";
import SignOutButton from "./SignOutButton";
import {
  BedDouble,
  Calendar,
  BarChart3,
  LogIn,
  Menu,
  X,
  Home,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  const search = useSearchContext();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    search.clearSearchValues();
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* ---------- Logo Section ---------- */}
          <button
            onClick={handleLogoClick}
            className="flex flex-col items-start group space-y-1"
          >
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <BedDouble className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight group-hover:text-primary-100 transition-colors">
                SmartNest
              </span>
            </div>
            <span className="text-xs text-white/80 font-light ml-10">
              Find your next university home
            </span>
          </button>

          {/* ---------- Desktop Navigation ---------- */}
          <nav className="hidden md:flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                <Link
                  to="/find-boardings"
                  className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Find Boardings
                </Link>

                <Link
                  to="/add-boarding"
                  className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Boarding
                </Link>

                <Link
                  to="/my-reservations"
                  className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  My Reservations
                </Link>

                <Link
                  to="/my-boardings"
                  className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  <BedDouble className="w-4 h-4 mr-2" />
                  My Boardings
                </Link>

                <Link
                  to="/analytics"
                  className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Link>

                <SignOutButton />
              </>
            ) : (
              <Link
                to="/sign-in"
                className="flex items-center bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 hover:shadow-md transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            )}
          </nav>

          {/* ---------- Mobile Menu Button ---------- */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ---------- Mobile Navigation ---------- */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col space-y-2 pb-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/find-boardings"
                  className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  <Home className="w-4 h-4 mr-2" /> Find Boardings
                </Link>

                <Link
                  to="/add-boarding"
                  className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Boarding
                </Link>

                <Link
                  to="/my-reservations"
                  className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  <Calendar className="w-4 h-4 mr-2" /> My Reservations
                </Link>

                <Link
                  to="/my-boardings"
                  className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  <BedDouble className="w-4 h-4 mr-2" /> My Boardings
                </Link>

                <Link
                  to="/analytics"
                  className="flex items-center text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
                >
                  <BarChart3 className="w-4 h-4 mr-2" /> Analytics
                </Link>

                <SignOutButton />
              </>
            ) : (
              <Link
                to="/sign-in"
                className="flex items-center bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 hover:shadow-md transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
