import React from 'react';

const SessionExpiredPopup = ({ onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>Session Expired</h2>
        <p>Your session has expired. Please log in again.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
  },
};

export default SessionExpiredPopup;
