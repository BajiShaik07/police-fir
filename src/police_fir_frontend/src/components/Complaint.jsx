import React, { useState } from "react";
import { police_fir_backend } from "declarations/police_fir_backend";
import Cbg from "../../public/complaint.jpg";
import "./Complaint.css";

const Complaint = () => {
  const initialFormData = {
    incidentDetails: "",
    dateTime: "",
    complainantName: "",
    complainantContact: "",
    location: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

            <button type="submit" className="btn">
              Submit FIR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Complaint;
