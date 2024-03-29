import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
};

export default App;
