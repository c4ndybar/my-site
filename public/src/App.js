import React from 'react';
import logo from './images/moto.jpg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hi there, welcome to Andy's site!
        </p>
        <a
          className="App-link"
          href="https://www.instagram.com/andydarrr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out my photos
        </a>
      </header>
    </div>
  );
}

export default App;
