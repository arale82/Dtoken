import React, {useState} from "react";
import { Principal } from "@dfinity/principal";
import { token_backend } from "../../../declarations/token_backend";

function Balance() {
  const [inputValue, setInputValue] = useState("");
  const [balanceResult, setBalanceResult] = useState("");
  const [isLoading, setLoading] = useState(false);
  
  let tokenSymbol = "";
  
  async function handleClick() {
    setLoading(true);
    //if first time, load token symbol
    if(!tokenSymbol){
      tokenSymbol = await token_backend.getSymbol();
    } 
    
    var balanceString = 0;
    if(inputValue) {
      try {
        const principal = Principal.fromText(inputValue);
        const balance = await token_backend.balanceOf(principal);
        balanceString = parseInt(balance).toLocaleString();
      } catch (error) {
        console.log("NO Principal found");
      }
      setBalanceResult( "This account has a balance of "+ balanceString +" "+ tokenSymbol +".");
    } else {
      console.log("NO Principal info");
      setBalanceResult("Please enter a Principal ID");
    }
    setLoading(false);
  }

  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
          disabled={isLoading}
        >
          Check Balance
        </button>
      </p>
      <p>{balanceResult}</p>
    </div>
  );
}

export default Balance;
