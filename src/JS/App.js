//import plogo from '../Logos/PocketPhDsLogo.JPG';
import '../CSS/App.css';

import Routes from './Routes.js';
import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="App" style={{ zoom: '75%' }}>
        <Routes />
        {/* <Footer /> */}
      </div>
    );
  }
}

export default App;
