import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import PoliceProfile from './NavProfile';
import ClientProfile from './ClientNavbarProfile';
import Signup from './SignUp';
import Compliant from './Complaint' ;
import CList from './CList';
import PList from './PList';

const AppRouter = () => {
  console.log("ko");

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/policeprofile" element={<PoliceProfile />} />
      <Route path="/userprofile" element={<ClientProfile />} />
      <Route path="/complaint" element={<Compliant />} />
      <Route path="/clist" element={<CList />} />
      <Route path="/plist" element={<PList />} />

    </Routes>
  );
};

export default AppRouter;
