import React, { Component } from 'react';
import logo from './logo.svg';
import './ComponentA.css';

class ComponentA extends Component {
  render() {
    return (
      <div className="ComponentA">
        <div className="ComponentA-header">
          <img src={logo} className="ComponentA-logo" alt="logo" />
          <h2>Welcome to React (Component)</h2>
        </div>
        <p className="ComponentA-intro">
          To get started, edit <code>src/ComponentA/ComponentA.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default ComponentA;
