import React, { Component } from 'react';
import { Map, ImageOverlay } from 'react-leaflet'
import HeatmapLayer from 'react-leaflet-heatmap-layer'

import ReactTable from 'react-table'
import logo from './logo.svg';
import L from 'leaflet'

import './App.css';
import "react-table/react-table.css";

class Api {
  constructor(host) {
    this.host = host
  }

  get(path, params = null) {
    var url = new URL(this.host + '/' + path)
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    }
    return fetch(url, {
      mode: 'cors'
    })
  }
}

const API_HOST = 'http://localhost:8000'

let api = new Api(API_HOST)

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      pages: 0,
      loading: false,
      frags: []
    }
  }

  requestData(pageSize, page, sorted, filtered) {
    let scope = this
    this.setState({
      loading: true,
    })
    return new Promise((resolve, reject) => {
      api.get('players', {
        limit: pageSize,
        offset: page * pageSize
      }).then(response => response.json())
        .then(data => {
          const res = {
            rows: data.results,
            pages: Math.ceil(data.count / pageSize)
          }
          resolve(res)
        })
    })
  }

  fetchData(state, instance) {
    this.requestData(
      state.pageSize,
      state.page,
      state.sorted,
      state.filtered
    ).then(res => {
      this.setState({
        data: res.rows,
        pages: res.pages,
        loading: false
      })
    })
  }

  fetchFrags() {
    let scope = this
    api.get('frags/', {
      map_id: 'DH-Stoumont',
      limit: 10000
    }).then(response => response.json())
    .then(data => {
      scope.setState({frags: data.results})
    })
  }

  componentDidMount() {
    this.fetchFrags()
  }

  render() {
    return (
      <div className="App">
        <Map
          style={{height: 1024}}
          bounds={[[32768,-16384], [-16384,32768]]}
          crs={L.CRS.Simple}
          minZoom={-7}
        >
          <ImageOverlay
            url='stoumont.png'
            bounds={[[32768,-16384], [-16384,32768]]}
          />
          <HeatmapLayer
            minOpacity={0.25}
            points={this.state.frags}
            longitudeExtractor={m => m['killer_location'][0]}
            latitudeExtractor={m => 16384 - m['killer_location'][1]}
            intensityExtractor={m => 2}
          />
        </Map>
        <ReactTable
          defaultPageSize={20}
          columns={[
            {
              Header: 'id',
              accessor: 'id'
            },
            {
              Header: 'name',
              accessor: 'names[0].name'
            },
            {
              Header: 'ip',
              accessor: 'ips[0].ip'
            }
          ]}
          manual
          sortable={false}
          data={this.state.data}
          pages={this.state.pages}
          loading={this.state.loading}
          onFetchData={this.fetchData.bind(this)}
          className="-striped -highlight"
          showPaginationTop={true}
        />
      </div>
    );
  }
}

export default App;
