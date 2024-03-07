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

  const handleAddUpdate = async (id) => {
    try {
      await police_fir_backend.addUpdateInFir(id, updateSubject, updateDescription);
      const updatedFirs = await police_fir_backend.getFirDetails();
      setFirs(updatedFirs);
      setUpdateSubject('');
      setUpdateDescription('');
    } catch (error) {
      console.error("Error adding update:", error);
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      await police_fir_backend.updateStatusInFir(id, newStatus);
      const updatedFirs = await police_fir_backend.getFirDetails();
      setFirs(updatedFirs);
      setNewStatus('');
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleFetchSingleFir = async (id) => {
    try {
      const singleFir = await police_fir_backend.getSingleFir(id);
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
              <tr key={fir.id}>
                <td>{fir.id}</td>
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
                      <li key={updateIndex}>{`${update[0]}: ${update[1]}`}</li>
                    ))}
                  </ul>
                </td>
                <td className="action-cell">
                  <button onClick={() => handleAddUpdate(fir.id)}>Add Update</button>
                  <button onClick={() => handleStatusUpdate(fir.id)}>Update Status</button>
                  <button onClick={() => handleFetchSingleFir(fir.id)}>Fetch Single FIR</button>
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
