import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId } from "declarations/police_fir_backend";
import './CList.css';

const CList = () => {
  const [firList, setFirList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isPolice, setIsPolice] = useState(false);
  const [isUser, setIsUser] = useState(false);
  let authClient;
  let actor;

  async function handleAuthenticated(authClient) {
    try {
      setIsConnected(true);

      if (!authClient) {
        console.error("Authentication client is not available.");
        return;
      }

      const identity = await authClient.getIdentity();

      if (!identity) {
        console.error("Identity is not available.");
        return;
      }

      actor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });

      const resp = await actor.isAccountExists();
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
    } catch (error) {
      console.error("Error in handleAuthenticated:", error);
    }
  }

  async function fetchFirList() {
    try {
      console.log("Fetching FIR details...");

      // Ensure the correct actor creation
      const authClient = await AuthClient.create();
      const identity = await authClient.getIdentity();
      const actor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });

      const response = await actor.getFirDetails(0); // Adjust the parameter if needed
      console.log("Response:", response);

      if (response.statusCode === BigInt(200)) {
        setFirList(response.user);
      } else {
        console.error("Error fetching FIR details:", response);
      }
    } catch (error) {
      console.error("Error in fetchFirList:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleWalletClick() {
    try {
      authClient = await AuthClient.create();

      if (await authClient.isAuthenticated()) {
        authClient.logout();
        window.location.href = "/";
      } else {
        authClient.login({
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
          onSuccess: async () => {
            await handleAuthenticated(authClient);
          },
          redirectTo:
            process.env.DFX_NETWORK === "ic"
              ? "https://identity.ic0.app/#authorize"
              : `http://${process.env.CANISTER_ID_internet_identity}.localhost:4943`,
        });
      }
    } catch (error) {
      console.error("Wallet click error:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authClient = await AuthClient.create();
        const identity = await authClient.getIdentity();
        const actor = createActor(canisterId, {
          agentOptions: {
            identity,
          },
        });

        const response = await actor.getFirDetails(0);

        if (response.statusCode === BigInt(200)) {
          setFirList(response.user);
        } else {
          console.error('Error fetching FIR details:', response);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function: Ensure to clean up resources if needed
    return () => {
      // Add cleanup logic here if necessary
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <div className='complaint-container'>
        <div className='complaint-list'>
          <h2>Complaint List</h2>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
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
                {firList.map((fir, index) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CList;
