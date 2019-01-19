import React, { Component } from 'react'

import './App.css';
import "react-table/react-table.css";

import Header from './Header'
import Main from './Main'

export default class App extends Component {

  render() {
    return <div>
        <Header />
        <Main />
      </div>
  }
}
