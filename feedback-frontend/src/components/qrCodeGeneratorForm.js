import React, { useState } from "react";
import "../styles/Global.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { fetchQrCode } from "../services/api";

const QrGenerator = ({ isOpen, onClose }) => { 
  const [url, setUrl] = useState("");
  const [counter, setCounter] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url || !counter) {
      setMessage("Please fill in both fields.");
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const data = await fetchQrCode(token, url, counter);
      if (data.success) { 
        if (data.qr) { 
          setQrImage(data.qr); 
          setMessage("Success! QR Code has been generated.");
        }
      } else {
        setMessage("Error: QR Code could not be generated.");
      }
    } catch (error) {
      setMessage("Error generating QR Code. Please try again.");
    }

    setUrl("");
    setCounter("");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = "qr_code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .print-message {
              font-size: 18px;
              margin-bottom: 20px;
              text-align: left; /* Left-align the message */
            }
            img {
              max-width: 100%;
              height: auto;
              display: block; 
              margin: 0 auto; 
            }
            .google-review {
              max-width: 100%;
              height: auto;
              display: block; 
              margin: 0 auto; 
              width:250px;
              margin-bottom:20px;
              }
          </style>
        </head>
        <body>
          <div class="print-message">We appreciate your feedback! Please scan this QR code to leave a review on Google.</div>
          <div class="google-review"> <img src='/google-reviews.png'></div>
          <img src="${qrImage}" alt="QR Code" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>X</button>

        <h4>Google Review QR Generator</h4>
        <p>This will allow you to generate QR codes for Google reviews.</p>

        {!qrImage ? (
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <input
                type="text"
                value={url}
                placeholder="Enter Google review page URL"
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="form-section">
              <input
                type="number"
                value={counter}
                placeholder="Enter counter number"
                onChange={(e) => {const value = e.target.value;
                  // Allow only 2-digit numbers
                  if (value.length <= 2 && (value === '' || /^\d{0,2}$/.test(value))) {
                    setCounter(value);
                  }
                }}
                required
              />
            </div>
            <div className="button-container">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit">Generate QR Code</button>
            </div>
          </form>
        ) : (
          <div className="qr-code-container">
            {message && <p className="success-message">{message}</p>}
            <img src={qrImage} alt="Generated QR Code" />
            <div className="qr-code-actions">
              <button onClick={handleDownload} style={{ marginRight: '10px' }}>
                <i className="fa-solid fa-download"></i> Download QR Code
              </button>
              <button onClick={handlePrint}>
                <i className="fa-solid fa-print"></i> Print QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrGenerator;
