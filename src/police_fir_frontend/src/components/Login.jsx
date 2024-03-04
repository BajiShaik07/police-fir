import React, { useState, useEffect } from 'react';
import { createActor, police_fir_backend } from "declarations/police_fir_backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";

const Login = () => {
  const [actor, setActor] = useState(police_fir_backend);

  const identityProvider = process.env.DFX_NETWORK === "ic"
    ? "https://identity.ic0.app/#authorize"
    : `http://${process.env.CANISTER_ID_internet_identity}.localhost:4943`;

  console.log(process.env.CANISTER_ID_police_fir_backend);

  const handleWhoAmIClick = async (e) => {
    e.preventDefault();
    try {
      const principal = await actor.whoami();
      document.getElementById("principal").innerText = principal.toString();
    } catch (error) {
      console.error("Error getting whoami:", error);
    }
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      const authClient = await AuthClient.create();

      await authClient.login({
        identityProvider: identityProvider, // Fix: use the correct variable name
      });

      const identity = authClient.getIdentity();
      const agent = new HttpAgent({ identity });
      setActor(createActor(process.env.CANISTER_ID_police_fir_backend, { agent }));
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const principal = await actor.whoami();
        document.getElementById("principal").innerText = principal.toString();
      } catch (error) {
        console.error("Error getting whoami:", error);
      }
    };

    fetchData();
  }, [actor]);

  return (
    <div>
      <button id="login" onClick={handleLoginClick}>
        Login!
      </button>
      <button id="whoAmI" onClick={handleWhoAmIClick}>
        Who Am I
      </button>
      <section id="principal"></section>
    </div>
  );
};

export default Login;
