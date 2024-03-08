import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './components/AppRouter';

const App = () => {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
};

export default App;
