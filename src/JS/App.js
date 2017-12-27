//import plogo from '../Logos/PocketPhDsLogo.JPG';
import '../CSS/App.css';

import Footer from './Footer.js';
import Routes from './Routes.js';
import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes />
        <Footer />
      </div>
    );
  }
}

export default App;
