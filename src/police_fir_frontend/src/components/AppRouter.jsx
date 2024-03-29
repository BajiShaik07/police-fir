import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SignUp from './SignUp';
import PoliceProfile from './NavPolice';
import UserProfile from './NavUser';
import Complaint from './Complaint';
import UList from './UList';
import PList from './PList';

const AppRouter = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/policeProfile" element={<PoliceProfile />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/uList" element={<UList />} />
        <Route path="/plist" element={<PList />} />
      </Routes>
  );
};

export default AppRouter;
