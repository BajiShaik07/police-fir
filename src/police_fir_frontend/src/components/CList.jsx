// CList.jsx

import React, { useState, useEffect } from 'react';
import { police_fir_backend } from "declarations/police_fir_backend";
import './CList.css';

const CList = () => {
  const [firs, setFirs] = useState([]);

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

  const handleFetchSingleFir = async (complaintId) => {
    try {
      const singleFir = await police_fir_backend.getSingleFir(complaintId);
      console.log("Single FIR:", singleFir);
      // Handle the single FIR data as needed
    } catch (error) {
      console.error("Error fetching single FIR:", error);
    }
  };

  return (
    <div className='complaint-container'>
      <div className='complaint-list'>
        <h2>Complaint List</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Complainant Name</th>
                <th>Contact</th>
                <th>Incident Details</th>
                <th>Location</th>
                <th>Date and Time</th>
                <th>Address</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {firs.map((fir) => (
                <tr key={fir.complaintId}>
                  <td>{fir.complaintId}</td>
                  <td>{fir.complainantName}</td>
                  <td>{fir.complainantContact}</td>
                  <td>{fir.incidentDetails}</td>
                  <td>{fir.location}</td>
                  <td>{fir.dateTime}</td>
                  <td>{fir.address}</td>
                  <td>{fir.status}</td>
                  <td>{fir.timestamp}</td>
                  <td>
                    <button onClick={() => handleFetchSingleFir(fir.complaintId)}>Fetch Single FIR</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CList;
