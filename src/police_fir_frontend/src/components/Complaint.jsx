import React, { useState } from "react";
import { police_fir_backend } from "declarations/police_fir_backend";
import Cbg from "../../public/complaint.jpg";
import "./Complaint.css";

const Complaint = () => {
  const defaultUserId = "123"; // Set a default user ID
  const initialFormData = {
    id: defaultUserId,
    incidentDetails: "",
    dateTime: "",
    complainantName: "",
    complainantContact: "",
    location: "",
    address: "",
    status: "Initial",
    timestamp: new Date().toISOString(),
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusUpdate = (newStatus) => {
    setFormData({
      ...formData,
      status: newStatus,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSearch = async (searchId) => {
    const idToSearch = searchId || defaultUserId; // Use default if searchId is not provided
    try {
      const foundData = await police_fir_backend.searchFirById(idToSearch);
      if (foundData) {
        setFormData(foundData);
      } else {
        alert("FIR not found with the specified ID");
      }
    } catch (error) {
      console.error("Error searching FIR:", error);
      alert("Failed to search FIR. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting FIR data:", formData);
      await police_fir_backend.submitFir(formData);
      console.log("FIR submission successful!");
      setFormData(initialFormData);
      alert("FIR submission successful!");
    } catch (error) {
      console.error("Error submitting FIR:", error);
      alert("Failed to submit FIR. Please try again later.");
    }
  };

  return (
    <div>
      <div className="complaint-bg">
        <img src={Cbg} alt="Complaints" />
      </div>
      <div className="complaint-container">
        <div className="complaint-form">
          <h2>Submit FIR</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="id">Complaint ID:</label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
            />
            <label htmlFor="incidentDetails">Incident Details:</label>
            <textarea
              id="incidentDetails"
              name="incidentDetails"
              value={formData.incidentDetails}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>

            <label htmlFor="dateTime">Date and Time of Incident:</label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              required
            />

            <label htmlFor="complainantName">Complainant Name:</label>
            <input
              type="text"
              id="complainantName"
              name="complainantName"
              value={formData.complainantName}
              onChange={handleChange}
              required
            />

            <label htmlFor="complainantContact">Complainant Contact:</label>
            <input
              type="tel"
              id="complainantContact"
              name="complainantContact"
              value={formData.complainantContact}
              onChange={handleChange}
              required
            />

            <label htmlFor="location">Location of Incident:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <label htmlFor="address">Complainant Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <label htmlFor="address">State And Pincode:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />

<label htmlFor="status">Status:</label>
            <input
              type="text"
              id="status"
              name="status"
              value={formData.status}
              readOnly
            />

            <label htmlFor="timestamp">Timestamp:</label>
            <input
              type="text"
              id="timestamp"
              name="timestamp"
              value={formData.timestamp}
              readOnly
            />

            <button
              type="button"
              className="btn"
              onClick={() => handleStatusUpdate("Updated")}
            >
              Update Status
            </button>

            <button type="submit" className="btn">
              Submit FIR
            </button>
          </form>

          <div>
            <h2>Search FIR by ID</h2>
            <label htmlFor="searchId">Enter ID (Default: {defaultUserId}):</label>
            <input
              type="text"
              id="searchId"
              name="searchId"
              value={formData.searchId}
              onChange={(e) => setFormData({ ...formData, searchId: e.target.value })}
            />

            <button
              type="button"
              className="btn"
              onClick={() => handleSearch(formData.searchId)}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaint;