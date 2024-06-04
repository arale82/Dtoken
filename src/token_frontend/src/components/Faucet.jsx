import React, { useState } from "react";
import { token_backend, canisterId, createActor } from "../../../declarations/token_backend";
import { AuthClient } from "@dfinity/auth-client";

function Faucet() {
  const [isLoading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Gimme gimme");

  async function handleClick(event) {
    setLoading(true);

    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    const authCanister = createActor(canisterId, {
      agentOptions : {
        identity,
      },
    });

    var testResult = await authCanister.payOut();
    setButtonText(testResult);
    //setLoading(false);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free Arale tokens here! Claim 10,000 ARAL coins to your account.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isLoading}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
