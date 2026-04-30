import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import QrGenerator from "./qrCodeGeneratorForm";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isDashboardPage = location.pathname === "/dashboard";
  const headerTitle =
    token && isDashboardPage ? "CXTracker Dashboard" : "CXTracker";

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <header className="header-container">
      <div className="logo-title-container">
        <h1 className="title">{headerTitle}</h1>
      </div>

      <div className="button-container">
        <>
          {token && isDashboardPage && (
            <button onClick={togglePopup} className="qr-code-button">
              <img
                className="google-review"
                alt="Google review"
                src="/Google-Review.png"
              ></img>
              QR Code Generator
            </button>
          )}
          {token && isDashboardPage && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </>
      </div>

      <QrGenerator isOpen={isPopupOpen} onClose={togglePopup} />
    </header>
  );
};

export default Header;
