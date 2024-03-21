import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import Login from './components/Login';
import Signup from './components/Signup'

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <Routes>
          <Route exact path='/' Component={HeroSection} />
          <Route exact path='/About' Component={WhyChooseUs} />
          <Route exact path='/Services' Component={HowItWorks} />
          <Route path='/login' Component={Login} />
          <Route path='/register' Component={Signup} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;