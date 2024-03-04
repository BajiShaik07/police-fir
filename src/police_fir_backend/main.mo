import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import RBTree "mo:base/RBTree";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Buffer "mo:base/Buffer";
import Shared "shared.mo";
actor {

  type Gender = {
    #Male;
    #Female;
  };

  type Fir = {
    id : Text;
    complainantContact : Text;
    complainantName : Text;
    address : Text;
    dateTime : Text;
    location : Text;
    incidentDetails : Text;
    status : Text;
    timestamp : Text;
    updates : [(Text, Text)];
    report_id : Text;
    description : Text;
  };

  type Police = {
    name : Text;
    dob : Text;
    gender : Gender;
    specialization : Text;
    requests : [Text];
  };

  type User = {
    name : Text;
    dob : Text;
    gender : Gender;
    polices : [Principal];
    noofrecords : Nat;
    requests : [Text];
  };

  type RequestStatus = {
    #Complete;
    #Reject;
    #Accept;
    #Nota;
  };

  type Request = {
    userPrincipal : Principal;
    policePrincipal : Principal;
    expries : Time.Time;
    note : Text;
    status : RequestStatus;
    isEmergency : Bool;
    requestedOn : Time.Time;
  };

  var users = RBTree.RBTree<Principal, User>(Principal.compare);
  var polices = RBTree.RBTree<Principal, Police>(Principal.compare);
  var requests = RBTree.RBTree<Text, Request>(Text.compare);

  // function to create a Police account
  public shared (msg) func createPolice(name : Text, dob : Text, gender : Gender, specialization : Text) : async {
    statusCode : Nat;
    msg : Text;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var police = polices.get(msg.caller);
      switch (police) {
        case (null) {
          var user = users.get(msg.caller);
          switch (user) {
            case (null) {
              var police : Police = {
                name = name;
                dob = dob;
                gender = gender;
                specialization = specialization;
                requests = [];
              };
              polices.put(msg.caller, police);
              return {
                statusCode = 200;
                msg = "Registered as Police Successfully.";
              };
            };
            case (?user) {
              return {
                statusCode = 403;
                msg = "A User Account Exists with this Identity";
              };
            };
          };
        };
        case (?user) {
          return {
            statusCode = 403;
            msg = "Police Already Exists with this Identity";
          };
        };
      };
    } else {
      return {
        statusCode = 404;
        msg = "Connect Wallet To Access This Function";
      };
    };
  };

  // function to create a User account
  public shared (msg) func createUser(name : Text, dob : Text, gender : Gender) : async {
    statusCode : Nat;
    msg : Text;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var user = users.get(msg.caller);
      switch (user) {
        case (null) {
          var police = polices.get(msg.caller);
          switch (police) {
            case (null) {
              var user : User = {
                name = name;
                dob = dob;
                gender = gender;
                polices = [];
                noofrecords = 0;
                requests = [];
              };
              users.put(msg.caller, user);
              return {
                statusCode = 200;
                msg = "Registered as User Successfully.";
              };
            };
            case (?police) {
              return {
                statusCode = 403;
                msg = "A Police Account Exists with this Identity";
              };
            };
          };
        };
        case (?user) {
          return {
            statusCode = 403;
            msg = "User account Already Exists with this Identity";
          };
        };
      };
    } else {
      return {
        statusCode = 404;
        msg = "Connect Wallet To Access This Function";
      };
    };
  };

  // function to check whether caller has a account or not
  public shared query (msg) func isAccountExists() : async {
    statusCode : Nat;
    msg : Text;
    principal : Principal;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var user = users.get(msg.caller);
      switch (user) {
        case (null) {
          var police = polices.get(msg.caller);
          switch (police) {
            case (null) {
              return { statusCode = 200; msg = "null"; principal = msg.caller };
            };
            case (?police) {
              return {
                statusCode = 200;
                msg = "police";
                principal = msg.caller;
              };
            };
          };
        };
        case (?user) {
          return { statusCode = 200; msg = "user"; principal = msg.caller };
        };
      };
    } else {
      return {
        statusCode = 404;
        msg = "Connect Wallet To Access This Function";
        principal = msg.caller;
      };
    };
  };

  public shared query (msg) func getPoliceDetails() : async {
    statusCode : Nat;
    doc : ?Police;
    msg : Text;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var police = polices.get(msg.caller);
      switch (police) {
        case (null) {
          return {
            statusCode = 403;
            doc = null;
            msg = "This identity doesn't have any Police Account";
          };
        };
        case (?police) {
          return {
            statusCode = 200;
            doc = ?police;
            msg = "Retrived Police Details Successsfully.";
          };
        };
      };
    } else {
      return {
        statusCode = 404;
        doc = null;
        msg = "Connect Wallet To Access This Function";
      };
    };
  };

  public shared query (msg) func getUserDetails() : async {
    statusCode : Nat;
    user : ?User;
    msg : Text;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var user = users.get(msg.caller);
      switch (user) {
        case (null) {
          return {
            statusCode = 403;
            user = null;
            msg = "This identity doesn't have any User Account";
          };
        };
        case (?user) {
          return {
            statusCode = 200;
            user = ?user;
            msg = "Retrived User Details Successsfully.";
          };
        };
      };
    } else {
      return {
        statusCode = 404;
        user = null;
        msg = "Connect Wallet To Access This Function";
      };
    };
  };
  var firs : [Fir] = [];

 public shared func updateFirStatus(firId: Text, newStatus: Text, policeOfficer: Text) : async {
  let index = Array.findIndexOf<Fir>(
    firs,
    (f) => f.id == firId
  );

  if (index >= 0) {
    let timestamp = Time.toText(Time.now());
    firs := Array.modify(
      firs,
      index,
      (f) => {
        f with {
          status = newStatus;
          timestamp = timestamp;
          updates = Array.append(f.updates, [(policeOfficer, timestamp)]);
        };
      }
    );
  } else {
    // Handle FIR not found error
  };
};

public shared query func getFirDetails() : async [Fir] {
  return firs;
};



  } else {
    // Handle FIR not found error
  };
};

  public shared query func getFirDetails() : async [Fir] {
    return firs;
  };
};
