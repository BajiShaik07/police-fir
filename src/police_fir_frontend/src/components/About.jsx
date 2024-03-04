// About.js

import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="container">
      <p className="paragraph">
      The criminal activities in India are increasing at a rapid rate. Many of these activities go unreported. Even after having an online portal for the police for storing FIRs and NCRs, most of the FIRs are handwritten as a traditional practice. In most of the cases, the complainant has to be present in the police station to file a cognizable offense. An effective system for e-governance was started in 2009 named Crime and Criminal Tracking Network and Systems (CCTNS) for the entire country. However, it is a centralized system for a particular state. Thus there is a need for a completely decentralized system for assuring that there is no central point of failure in the system and complaints are managed securely protected from unauthorized access. Our aim is to propose a blockchain-based solution to manage complaints against both cognizable and non-cognizable offenses. The FIR filed by the police will be encrypted, stored in the IPFS and hash is added to the blockchain network. If the police decide not to file the FIR under pressure or deny receiving any complaint, then the complainant will have strong proof against him/her as the complaint along with its timestamp was stored on the blockchain network. Having all the records stored in an immutable database would remove any chances of the FIR/NCR being tampered and going unnoticed.
      </p><br/>
      <p className="paragraph">
      In India, complaints regarding offenses have to be registered under the law. There are two types of offenses i.e. cognizable and non-cognizable offenses. Cognizable offenses include serious types of crimes like murder, theft, kidnapping, and rape, etc. As defined in Section 2 (c) of the Criminal Procedure Code 1973, in case of a cognizable offense, police can arrest
the suspect without any warrant. The assigned inspector can start the investigation process without any orders from the court. In the
commission of any cognizable offense, the First information report aka FIR. is registered at the police
station. Any individual can file an FIR. if he/she is a victim or has seen the offense being committed. FIR details include the complainant’s name and address, date and time of location and facts of the incident, etc. Once the FIR is registered, chargesheet report is filed by the police officer. The complainant can apply for acquiring the chargesheet by submitting a letter under th  Right to Information Act (RTI) and by paying a certain amount of fees to the court.
      </p>
    </div>
  );
};

export default About;
