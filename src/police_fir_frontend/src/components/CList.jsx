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

  return (
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
              {/* Add other table headers as needed */}
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
                {/* Add other table cells as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CList;
