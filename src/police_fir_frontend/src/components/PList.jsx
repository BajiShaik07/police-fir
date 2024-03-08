import React, { useState, useEffect } from 'react';
import { police_fir_backend } from "declarations/police_fir_backend";
import './PList.css';

const PList = () => {
  const [firs, setFirs] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [updateSubject, setUpdateSubject] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');

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

  const handleAddUpdate = async (complaintId) => {
    try {
      const timestamp = new Date().toISOString();
      await police_fir_backend.addUpdateInFir(complaintId, updateSubject, updateDescription, timestamp);
      const updatedFirs = await police_fir_backend.getFirDetails();
      setFirs(updatedFirs);
      setUpdateSubject('');
      setUpdateDescription('');
      alert("Update added successfully!");
    } catch (error) {
      console.error("Error adding update:", error);
    }
  };

  const handleStatusUpdate = async (complaintId) => {
    try {
      await police_fir_backend.updateStatusInFir(complaintId, newStatus);
      const updatedFirs = await police_fir_backend.getFirDetails();
      setFirs(updatedFirs);
      setNewStatus('');
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className='complaint-container'>
      <div className='complaint-list'>
        <h2>Complaint List</h2>
        <div className="input-container">
          <label htmlFor="updateSubject">Update Subject:</label>
          <input
            type="text"
            id="updateSubject"
            value={updateSubject}
            onChange={(e) => setUpdateSubject(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="updateDescription">Update Description:</label>
          <input
            type="text"
            id="updateDescription"
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="newStatus">New Status:</label>
          <input
            type="text"
            id="newStatus"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
        </div>
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
                <td className="status-cell">
                  {fir.status}
                  <ul>
                    {fir.updates.map((update, updateIndex) => (
                      <li key={updateIndex}>{`${update[0]}: ${update[1]} - ${update[2]}`}</li>
                    ))}
                  </ul>
                </td>
                <td className="action-cell">
                  <button onClick={() => handleAddUpdate(fir.complaintId)}>Add Update</button>
                  <button onClick={() => handleStatusUpdate(fir.complaintId)}>Update Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PList;
