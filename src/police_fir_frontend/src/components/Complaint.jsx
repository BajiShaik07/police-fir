import React, { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "declarations/police_fir_backend";
import Cbg from "../../public/complaint.jpg";
import "./Complaint.css";
import { Link, Navigate } from "react-router-dom"; // Make sure to import Link from react-router-dom
import { HttpAgent } from "@dfinity/agent";

const Complaint = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fir Details
  const [incidentDetails, setIncidentDetails] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [complainantName, setComplainantName] = useState("");
  const [complainantContact, setComplainantContact] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null); // Change image state type to File
  const [video, setVideo] = useState(null); // Change video state type to File

  // Authentication
  const [principal, setPrincipal] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isPolice, setIsPolice] = useState(false);
  const [isUser, setIsUser] = useState(false);
  let authClient;
  let actor;

  async function handleAuthenticated(authClient) {
    setIsConnected(true);
    const identity = await authClient.getIdentity();
    actor = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    var resp = await actor.isAccountExists();
    console.log(resp);
    if (resp.statusCode === BigInt(200)) {
      setPrincipal(resp.principal.toString());
      if (resp.msg === "null") {
        setLoggedIn(true);
        setIsConnected(true);
      } else if (resp.msg === "police") {
        setIsConnected(true);
        setIsPolice(true);
        setLoggedIn(true);
      } else {
        setIsConnected(true);
        setIsUser(true);
        setLoggedIn(true);
      }
    }
    console.log(isConnected, isPolice, isUser, loggedIn);
  }

  async function handleWalletClick() {
    var authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      authClient.logout();
      window.location.href = "/"; // Redirect to the home page after logout
    } else {
      authClient.login({
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        identityProvider:
          process.env.DFX_NETWORK === "ic"
            ? "https://identity.ic0.app/#authorize"
            : `http://localhost:4943?canisterId=${process.env.CANISTER_ID_internet_identity}`,
        onSuccess: async () => {
          await handleAuthenticated(authClient); // Await the function call
        },
      });
    }
  }

  async function reconnectWallet() {
    console.log("connec");
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      await handleAuthenticated(authClient);
    } else {
      actor = police_fir_backend;
    }
  }

  useEffect(() => {
    async function sendRequest() {
      await reconnectWallet();
      console.log("comple");
      setIsLoading(false);
      var resp = await actor.createFirDetails();
      console.log(resp);
      if (resp.statusCode === BigInt(200)) {
        var user = resp.user[0];
        setDob(user.dob);
        setIncidentDetails(user.incidentDetails);
        setDateTime(user.dateTime);
        setAddress(user.address);
        setComplainantName(user.complainantName);
        setComplainantContact(user.complainantContact);
        setLocation(user.location);
        setImage(user.image);
        setVideo(user.video);
      }
    }
    sendRequest();
  }, []);

  // authentication ends

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsBlurred(!isBlurred);
  };
  const hamburger_class = isMenuOpen
    ? "hamburger hamburger--spring is-active"
    : "hamburger hamburger--spring";

    const ski = async () => {
      try {
        // Validate form inputs before submission
        if (!incidentDetails || !dateTime || !complainantName || !complainantContact || !location || !address) {
          alert("Please fill in all required fields.");
          return;
        }
    
        // Create a FormData object to send files
        const formData = new FormData();
        formData.append("incidentDetails", incidentDetails);
        formData.append("dateTime", dateTime);
        formData.append("complainantName", complainantName);
        formData.append("complainantContact", complainantContact);
        formData.append("location", location);
        formData.append("address", address);
        formData.append("image", image); // Assuming image is a File object
        formData.append("video", video); // Assuming video is a File object
        var authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();
        var actor = createActor(canisterId, {
          agentOptions: {
            identity,
          },
        });
    
        if (response.ok) {
          // Handle successful submission
          console.log("FIR submitted successfully!");
          // You may want to redirect or show a success message
        } else {
          // Handle submission failure
          console.error("Failed to submit FIR");
          // You may want to show an error message
        }
      } catch (error) {
        console.error("Error submitting FIR", error);
        // Handle unexpected errors
      }
    };
    

  return isLoading === false ? (
    <div className="navbar-container profile-body">
      {!isUser ? <Navigate to="/" /> : null}

      <nav className="navbar">
        <div className="logo">
          <img src="logo.jpg" alt="User Logo" />
          <span className="nav-heading">User</span>
        </div>
        <div className="profile">
          <a href="/userprofile">
            <img src="user-image.png" alt="Profile Pic" />
          </a>
          <button
            className={hamburger_class}
            type="button"
            onClick={toggleMenu}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </nav>
      <div>
        <div className="complaint-bg">
          <img src={Cbg} alt="Complaints" />
        </div>
        <div className="complaint-container">
          <div className="complaint-form">
            <h2>Submit FIR</h2>
            <form>
              <label htmlFor="incidentDetails">Incident Details:</label>
              <textarea
                id="incidentDetails"
                name="incidentDetails"
                value={incidentDetails}
                onChange={(e) => setIncidentDetails(e.target.value)}
                rows="4"
                required
              ></textarea>

              <label htmlFor="dateTime">Date and Time of Incident:</label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
              />

              <label htmlFor="complainantName">Complainant Name:</label>
              <input
                type="text"
                id="complainantName"
                name="complainantName"
                value={complainantName}
                onChange={(e) => setComplainantName(e.target.value)}
                required
              />

              <label htmlFor="complainantContact">Complainant Contact:</label>
              <input
                type="tel"
                id="complainantContact"
                name="complainantContact"
                value={complainantContact}
                onChange={(e) => setComplainantContact(e.target.value)}
                required
              />

              <label htmlFor="location">Location of Incident:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <label htmlFor="address">Complainant Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <label htmlFor="image">Upload Image (if applicable):</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <label htmlFor="video">Upload Video (if applicable):</label>
              <input
                type="file"
                id="video"
                name="video"
                accept="video/*"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
              />

              <button type="button" onClick={ski} className="btn">
                Submit FIR
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className={`dropdown-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="dropdown-box">
          <Link className="button" to="/complaint">
            Raise Complaint
          </Link>
          <Link className="button" to="/clist">
            Complaint List
          </Link>
          <Link className="button" to="/user_qr">
            QR Scan
          </Link>
          <a className="button" href="https://0fea70bb93826fd071.gradio.live">
            Chat Bot
          </a>
        </div>
        <div className="dropdown-box">
          <hr />
          <button className="button" onClick={handleWalletClick}>
            Logout
          </button>
          <div className="social-icons">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Complaint;
