import React, { useState, useEffect } from 'react';
import { police_fir_backend } from "declarations/police_fir_backend";
import './CList.css';

const CList = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const fetchedComplaints = await police_fir_backend.getComplaints(); // Replace with your actual function
        setComplaints(fetchedComplaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className='complaint-container'>
      <div className='complaint-list'>
        <h2>Complaint List</h2>
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
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.complainantName}</td>
                <td>{complaint.complainantContact}</td>
                <td>{complaint.incidentDetails}</td>
                <td>{complaint.location}</td>
                <td>{complaint.dateTime}</td>
                <td>{complaint.address}</td>
                <td>{complaint.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CList;
