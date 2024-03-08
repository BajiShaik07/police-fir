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
  const [searchKeyword, setSearchKeyword] = useState('');

  const generateRandomId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
  }, []);

  const handleAddComplaint = async () => {
    try {
      const timestamp = new Date().toISOString();
      const newId = generateRandomId();
      await police_fir_backend.submitFir({
        id: newId,
        complainantName,
        complainantContact,
        incidentDetails,
        location,
        address,
        state,
        timestamp,
      });
      const updatedFirs = await police_fir_backend.getFirDetails();
      setFirs(updatedFirs);
      setId(newId);
      setComplainantName('');
      setComplainantContact('');
      setIncidentDetails('');
      setLocation('');
      setAddress('');
      setState('');
      alert("Complaint submitted successfully!");
    } catch (error) {
      console.error("Error adding complaint:", error);
    }
  };

  const handleSearchFir = async () => {
    try {
      const singleFir = await police_fir_backend.getSingleFir(searchKeyword);
      console.log("Single FIR:", singleFir);
      // Handle the single FIR data as needed
    } catch (error) {
      console.error("Error fetching single FIR:", error);
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
      <div className='complaint-list'>
        <h2>Complaint List</h2>
        <div className="search-container">
          <label htmlFor="searchKeyword">Search FIR by Complaint ID:</label>
          <input
            type="text"
            id="searchKeyword"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button onClick={handleSearchFir}>Search</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Complainant Name</th>
              <th>Contact</th>
              <th>Incident Details</th>
              <th>Location</th>
              <th>State</th>
              <th>Date and Time</th>
              <th>Address</th>
              <th>Status</th>
              <th>Timestamp</th>
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
                <td>{fir.state}</td>
                <td>{fir.dateTime}</td>
                <td>{fir.address}</td>
                <td>{fir.status}</td>
                <td>{fir.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Complaint;
