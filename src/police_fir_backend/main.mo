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
    timestamp : Text;
    updates : [(Text, Text)];
    state : Text;
    // status :Text;
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

  public shared query (msg) func policeScan(principal : Text) : async {
    statusCode : Nat;
    user : ?{
      name : Text;
      dob : Text;
      gender : Gender;
      noofrecords : Nat;
    };
    msg : Text;
    is_having_access : Bool;
    is_having_emergency : Bool;
    is_pending : Bool;
    request : ?Request;
  } {
    if (not Principal.isAnonymous(msg.caller)) {
      var police = polices.get(msg.caller);
      switch (police) {
        case (null) {
          return {
            statusCode = 403;
            user = null;
            msg = "Only Polices can Access this method";
            is_having_access = false;
            is_having_emergency = false;
            is_pending = false;
            request = null;
          };
        };
        case (?police) {
          var user_principal = Principal.fromText(principal);
          var user = users.get(user_principal);
          switch (user) {
            case (null) {
              return {
                statusCode = 403;
                user = null;
                msg = "Invalid User QR Code Scanned.";
                is_having_access = false;
                is_having_emergency = false;
                is_pending = false;
                request = null;
              };
            };
            case (?user) {
              var is_having_access = false;
              var is_having_emergency = false;
              var is_pending = false;
              var request_codes = Array.reverse(user.requests);
              var req_ob : ?Request = null;
              label name for (request_code in request_codes.vals()) {
                req_ob := requests.get(request_code);
                switch (req_ob) {
                  case (null) {
                    continue name;
                  };
                  case (?req_ob) {
                    if (req_ob.policePrincipal == msg.caller) {
                      if ((req_ob.status == #Nota or (req_ob.status == #Accept and req_ob.expries > Time.now())) and req_ob.isEmergency) {
                        is_having_emergency := true;
                      } else if ((req_ob.status == #Accept and req_ob.expries > Time.now()) and (not req_ob.isEmergency)) {
                        is_having_access := true;
                      } else if (req_ob.status == #Nota) {
                        is_pending := true;
                      };
                    };
                  };
                };

                if (is_having_access or is_having_emergency or is_pending) {
                  break name;
                };

              };
              var hiddenuser = {
                name = user.name;
                dob = user.dob;
                gender = user.gender;
                noofrecords = user.noofrecords;
              };
              return {
                statusCode = 200;
                user = ?hiddenuser;
                msg = "Retrived Scan Details Successfully.";
                is_having_access = is_having_access;
                is_having_emergency = is_having_emergency;
                is_pending = is_pending;
                request = req_ob;
              };
            };
          };
        };
      };
    } else {
      return {
        statusCode = 404;
        user = null;
        msg = "Connect Wallet To Access This Function";
        is_having_access = false;
        is_having_emergency = false;
        is_pending = false;
        request = null;
      };
    };
  };

  var firs : [Fir] = [];

  public shared func submitFir(fir : Fir) : async () {
    firs := Array.append<Fir>(firs, [fir]);
  };

  public shared query func getSingleFir(id : Text) : async ?Fir {
    // array.filter vadi single fir ni return cheyyali
    return Array.find<Fir>(firs, func x = x.id == id);
  };

  public shared func addUpdateInFir(id : Text, subject : Text, description : Text) : async {
    statusCode : Nat;
    msg : Text;
  } {
    var fir = Array.find<Fir>(firs, func x = x.id == id);
    // Array.append<Text>(doct_req, Array.make<Text>(uuid)) Array.size<Text>(doctor.requests)
    switch (fir) {
      case (null) {
        return {
          statusCode = 400;
          msg = "Invalid id was Given.";
        };
      };
      case (?fir) {
        var newFir : Fir = {
          id = fir.id;
          complainantContact = fir.complainantContact;
          complainantName = fir.complainantName;
          address = fir.address;
          dateTime = fir.dateTime;
          location = fir.location;
          incidentDetails = fir.incidentDetails;
          timestamp = fir.timestamp;
          updates = Array.append<(Text, Text)>(fir.updates, Array.make<(Text, Text)>((subject, description)));
          state = fir.state;
        };
        var new_firs = Array.filter<Fir>(firs, func x = x.id != id);
        new_firs := Array.append<Fir>(new_firs, [newFir]);
        firs := new_firs;
        return {
          statusCode = 200;
          msg = "Added Update to fir Successfully.";
        };
      };
    };
  };

  public shared func updateStatusInFir(id : Text, status : Text) : async {
    statusCode : Nat;
    msg : Text;
  } {
    var fir = Array.find<Fir>(firs, func x = x.id == id);
    // Array.append<Text>(doct_req, Array.make<Text>(uuid)) Array.size<Text>(doctor.requests)
    switch (fir) {
      case (null) {
        return {
          statusCode = 400;
          msg = "Invalid id was Given.";
        };
      };
      case (?fir) {
        var newFir : Fir = {
          id = fir.id;
          complainantContact = fir.complainantContact;
          complainantName = fir.complainantName;
          address = fir.address;
          dateTime = fir.dateTime;
          location = fir.location;
          incidentDetails = fir.incidentDetails;
          status = status;
          timestamp = fir.timestamp;
          updates = fir.updates;
          state = fir.state;
        };
        var new_firs = Array.filter<Fir>(firs, func x = x.id != id);
        new_firs := Array.append<Fir>(new_firs, [newFir]);
        firs := new_firs;
        return {
          statusCode = 200;
          msg = "Updated Status in fir Successfully.";
        };
      };
    };
  };
  public shared query func getFirDetails() : async [Fir] {
    return firs;
  };

};
