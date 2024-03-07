import React, { useState } from 'react';
import { police_fir_backend } from 'declarations/police_fir_backend';
import './Complaint.css'

const Complaint = () => {
  const [complaintId, setComplaintId] = useState(1);
  const [complainantName, setComplainantName] = useState('');
  const [complainantContact, setComplainantContact] = useState('');
  const [address, setAddress] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [incidentDetails, setIncidentDetails] = useState('');

  // Additional fields
  const initialStatus = 'Pending';
  const initialTimestamp = new Date().toISOString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = initialStatus;
    const timestamp = initialTimestamp;
    const updates = [];
    const state = 'Open';

    const fir = {
      id: complaintId.toString(),
      complainantName,
      complainantContact,
      address,
      dateTime,
      location,
      incidentDetails,
      timestamp,
      updates,
      status,
      state,
    };

    try {
      await police_fir_backend.submitFir(fir);
      setComplaintId((prevId) => prevId + 1);
    } catch (error) {
      console.error('Error submitting FIR:', error);
    }
  };

  return (
    <div>
      <h2>File a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="complaintId">Complaint ID:</label>
        <input type="text" id="complaintId" value={complaintId} readOnly />

        <label htmlFor="complainantName">Complainant Name:</label>
        <input
          type="text"
          id="complainantName"
          value={complainantName}
          onChange={(e) => setComplainantName(e.target.value)}
        />

        <label htmlFor="complainantContact">Complainant Contact:</label>
        <input
          type="text"
          id="complainantContact"
          value={complainantContact}
          onChange={(e) => setComplainantContact(e.target.value)}
        />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label htmlFor="dateTime">Date and Time:</label>
        <input
          type="text"
          id="dateTime"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />

        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label htmlFor="incidentDetails">Incident Details:</label>
        <input
          type="text"
          id="incidentDetails"
          value={incidentDetails}
          onChange={(e) => setIncidentDetails(e.target.value)}
        />

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
};

export default Complaint;