import React, { Component } from 'react';
//import plogo from '../Logos/PocketPhDsLogo.JPG';
import '../CSS/App.css';
import Routes from './Routes.js';
import Footer from './Footer.js';



class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes/>



        <Footer/>

      </div>
    );
  }
}

export default App;
