import React, { useState } from "react";
import { token_backend, canisterId, createActor } from "../../../declarations/token_backend";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";

function Transfer() {
  const [isLoading, setLoading] = useState(false);
  const [inputToValue, setInputToValue] = useState("");
  const [inputAmountValue, setInputAmountValue] = useState("");
  const [transferResult, setTransferResult] = useState("");
  
  async function handleClick() {
    setLoading(true);
    
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    const authCanister = createActor(canisterId, {
      agentOptions : {
        identity,
      },
    });

    if(inputToValue && inputAmountValue){
      const principal = Principal.fromText(inputToValue);
      const result = await authCanister.transfer(principal, parseInt(inputAmountValue));
      setTransferResult(result);
    } else {
      setTransferResult("Please insert a Principal ID and amount.");
    }
    setLoading(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                onChange={(e) => setInputToValue(e.target.value)}
                value={inputToValue}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                onChange={(e) => setInputAmountValue(e.target.value)}
                value={inputAmountValue}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isLoading} >
            Transfer
          </button>
        </p>
        <p>{transferResult}</p>
      </div>
    </div>
  );
}

export default Transfer;
