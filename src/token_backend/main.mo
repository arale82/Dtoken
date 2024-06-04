import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
//"zqw2a-5kebv-auszo-7hv2w-gyezp-a6rce-hmaes-dert6-izm4z-3tll3-6qe"


actor Token {
  
  let owner : Principal = Principal.fromText("zqw2a-5kebv-auszo-7hv2w-gyezp-a6rce-hmaes-dert6-izm4z-3tll3-6qe");
  let totalSupply : Nat = 1000000000;
  let symbol : Text = "ARAL";

  //PRIVATE: only modified within the functions
  //Hashmap to store owners and tokens => easy to search but not STABLE
  private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  //Array to store owners and tokens => STABLE
  private stable var balanceEntries : [(Principal, Nat)] = [];
  //first time we give tokens to the owner - in case of first deploy.
  if(balances.size() < 1){
    balances.put(owner, totalSupply);
  };

  public query func balanceOf(who : Principal) : async Nat {
    let balance : Nat = switch(balances.get(who)) {
      case null 0;
      case (?result) result;
    }; 
    return balance;
  };

  public query func getSymbol() : async Text {
    return symbol;
  };

  //shared(msg) => the caller and other info will be saved in the msg var
  public shared(msg) func payOut() : async Text {
    Debug.print(debug_show(msg.caller));
    //only add free amount if the caller is new.
    if(balances.get(msg.caller) == null) {
      let amount = 10000;
      let result = await transfer(msg.caller, amount);
      return result;
    } else {
      return "Already claimed";
    }
    
  };

  public shared(msg) func transfer(to : Principal, amount : Nat) : async Text {
    //1. take away from one account
    //2. add to other account
    let fromBalance = await balanceOf(msg.caller);
    if(fromBalance >= amount){
      
      let newFromBalance = fromBalance - amount;
      balances.put(msg.caller, newFromBalance);

      let toBalance =  await balanceOf(to);
      let newToBalance = toBalance + amount;
      balances.put(to, newToBalance);
      return "Success";
    } else {
      return "Insufficient funds";
    }
  };

  system func preupgrade() {
    balanceEntries := Iter.toArray(balances.entries());
  };

  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
    //first time we give tokens to the owner.
    if(balances.size() < 1){
      balances.put(owner, totalSupply);
    };
  };
  
};
