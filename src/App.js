import React, { Component } from 'react'

import './App.css';
import "react-table/react-table.css";
import api from './api.js'

import Header from './Header'
import Main from './Main'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.histogramData = {}
    this.state = {
      data: [],
      pages: 0,
      loading: false,
      frags: [],
      chartData: [],
      damageTypes: [],
      map: 'DH-Stoumont_Advance',
      normalize: false,
    }
  }

  fetchFrags() {
    let scope = this
    api.get('frags/', {
      map_id: scope.state.map,
      limit: 16384
    }).then(response => response.json())
    .then(data => {
      scope.setState({frags: data.results})
    })
  }

  changeMap(map) {
    this.setState({map}, () => {
      this.fetchFrags()
    })
  }

  componentDidMount() {
    this.fetchFrags()
  }

  render() {
    return <div>
        <Header />
        <Main />
      </div>
  }
}
