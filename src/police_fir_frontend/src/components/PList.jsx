import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { police_fir_backend } from "declarations/police_fir_backend";
import './PList.css';

const PList = () => {
  const [firs, setFirs] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const fetchFir = async () => {
      try {
        const fetchedFir = await police_fir_backend.getFirDetails();
        setFirs(fetchedFir);
      } catch (error) {
        console.error("Error fetching Fir:", error);
      }
    };

    fetchFir();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsBlurred(!isBlurred);
  };

  const handleWalletClick = () => {
    // Implement your logout logic here
  };

  const handleStatusUpdate = async (index, newStatus) => {
    try {
      await police_fir_backend.updateFirStatus(firs[index].id, newStatus);

      const updatedFirs = [...firs];
      updatedFirs[index].status = newStatus;
      setFirs(updatedFirs);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const hamburger_class = isMenuOpen ? 'hamburger hamburger--spring is-active' : 'hamburger hamburger--spring';

  return (
    <div className={`navbar-container profile-body ${isBlurred ? 'blurred' : ''}`}>
      <nav className="navbar">
        <div className="logo">
          <img src="logo.jpg" alt="Police Logo" />
          <span className='nav-heading'>Police</span>
        </div>
        <div className="profile">
          <img src="police-image.png" alt="Profile Pic" />
          <button className={hamburger_class} type="button" onClick={toggleMenu}>
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </nav>

      <div className='complaint-container'>
        <div className='complaint-list'>
          <h2>Complaint List</h2>
          <table>
            <thead>
              <tr>
                <th>Complainant Name</th>
                <th>Contact</th>
                <th>Incident Details</th>
                <th>Location</th>
                <th>Date and Time</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {firs.map((fir, index) => (
                <tr key={index}>
                  <td>{fir.complainantName}</td>
                  <td>{fir.complainantContact}</td>
                  <td>{fir.incidentDetails}</td>
                  <td>{fir.location}</td>
                  <td>{fir.dateTime}</td>
                  <td>{fir.address}</td>
                  <td className="status-cell">{fir.status}</td>
                  <td className="action-cell">
                    <button onClick={() => handleStatusUpdate(index, 'Accepted')}>Accept</button>
                    <button onClick={() => handleStatusUpdate(index, 'In Progress')}>In Progress</button>
                    <button onClick={() => handleStatusUpdate(index, 'Completed')}>Completed</button>
                    <button onClick={() => handleStatusUpdate(index, 'Fake Complaint')}>Fake Complaint</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="dropdown-box">
            <Link className="button" to="/clist">
              Complaint Lists
            </Link>
            <Link className="button" to="/profile_qr">
              QR Scan
            </Link>
          </div>
          <div className="dropdown-box">
            <hr />
            <button className="button" onClick={handleWalletClick}>
              Logout
            </button>
            <div className="social-icons">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PList;
