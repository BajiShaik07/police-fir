// Complaint.jsx

import React, { useState, useEffect } from 'react';
import { police_fir_backend } from "declarations/police_fir_backend";
import './Complaint.css';

const Complaint = () => {
  const [firs, setFirs] = useState([]);
  const [id, setId] = useState('');
  const [complainantName, setComplainantName] = useState('');
  const [complainantContact, setComplainantContact] = useState('');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [dateTime, setDateTime] = useState('');

  const generateRandomId = () => {
    let newId;
    do {
      newId = Math.floor(100000 + Math.random() * 900000).toString();
    } while (firs.some(fir => fir.id === newId));

    return newId;
  };

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
    setId(generateRandomId());
  }, []);

  const handleAddComplaint = async () => {
    try {
      const timestamp = new Date().toISOString();
      await police_fir_backend.submitFir({
        id: id,
        complainantContact,
        complainantName,
        address,
        dateTime,
        location,
        incidentDetails,
        timestamp,
        updates: [],
        state,
        status : ""
      });
      const updatedFirs = await police_fir_backend.getFirDetails();
      setFirs(updatedFirs);

      // Wait for the state to be updated
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Use the newId after the state is updated
      setId(generateRandomId());
      setComplainantName('');
      setComplainantContact('');
      setIncidentDetails('');
      setLocation('');
      setAddress('');
      setState('');
      setDateTime('');
      alert("Complaint submitted successfully!");
      console.log("Complaint submitted successfully!");
    } catch (error) {
      console.error("Error adding complaint:", error);
    }
  };

  return (
    <div className='complaint-container'>
      <div className='complaint-form'>
        <h2>File a Complaint</h2>
        <div className="input-container">
          <label htmlFor="id">Complaint ID:</label>
          <input
            type="text"
            id="id"
            value={id}
            readOnly
          />
        </div>
        <div className="input-container">
          <label htmlFor="complainantName">Complainant Name:</label>
          <input
            type="text"
            id="complainantName"
            value={complainantName}
            onChange={(e) => setComplainantName(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="complainantContact">Complainant Contact:</label>
          <input
            type="text"
            id="complainantContact"
            value={complainantContact}
            onChange={(e) => setComplainantContact(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="incidentDetails">Incident Details:</label>
          <textarea
            id="incidentDetails"
            value={incidentDetails}
            onChange={(e) => setIncidentDetails(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="dateTime">Date and Time:</label>
          <input
            type="datetime-local"
            id="dateTime"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <button onClick={handleAddComplaint}>Submit Complaint</button>
      </div>
    </div>
  );
};

export default Complaint;
