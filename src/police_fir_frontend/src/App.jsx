import React from 'react';
// import Complaint from './components/Complaint'; 
// import Navbar from './Navbar/Navbar';
// import { Route, Routes } from 'react-router-dom';
// import Home from './components/Home';
// import About from './components/About';
// import Signup from './components/SignUp';
import AppRouter from './components/AppRouter';

const App = () => {
  return (
    <div className="App">
      <AppRouter/>
      {/* <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path = '/complaint' element={<Complaint />} />
        <Route path='/about' element={<About />} />
      </Routes> */}
    </div>
  );
};

export default App;


