import React, { Component } from 'react';
import { Map, ImageOverlay } from 'react-leaflet'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import AsyncSelect from 'react-select/lib/Async'
import _ from 'lodash'
import { Chart, Axis, Series, Tooltip, Cursor, Line, Bar } from 'react-charts'

import ReactTable from 'react-table'
import logo from './logo.svg';
import L from 'leaflet'

import './App.css';
import "react-table/react-table.css";
import Api from './api.js'

import { cloneDeep } from 'lodash'

const API_HOST = 'http://localhost:8000'

let api = new Api(API_HOST)

let damageTypeOptions = inputValue => {
  return new Promise(resolve => {
    api.get('damage-types/', {search: inputValue, limit: 0}).then(response => response.json())
    .then(response => {
      resolve(response.results.map(x => ({label: x.id, value: x.id})))
    })
  })
}

let mapOptions = inputValue => {
  return new Promise(resolve => {
    api.get('maps/', {search: inputValue, limit: 0}).then(response => response.json())
    .then(response => {
      resolve(response.results.map(x => ({label: x.name, value: x.name})))
    })
  })
}

class App extends Component {

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
      map_id: scope.state.map,
      limit: 16384
    }).then(response => response.json())
    .then(data => {
      scope.setState({frags: data.results})
    })
  }

  fetchHistogram() {
    let scope = this
    api.get('frags/range_histogram', {
      'damage_type_ids': this.state.damageTypes
    }).then(response => response.json())
    .then(data => {
      this.histogramData = cloneDeep(data)
      this.updateChartData()
    })
  }

  updateChartData() {
    let data = cloneDeep(this.histogramData)
    if (this.state.normalize) {
      data = Object.keys(data).map(key => {
        let value = data[key]
        value.bins = value.bins.map(x => {
          return [x[0], x[1] / value.total]
        })
        return value
      })
    }
    let chartData = Object.keys(data).map(key => {
      return {
        label: key,
        data: data[key].bins
      }
    })
    this.setState({chartData})
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
    return (
      <div className="App">
        <Map
          style={{height: 800}}
          bounds={[[-16384,-16384], [32768,32768]]}
          crs={L.CRS.Simple}
          minZoom={-7}
        >
          <ImageOverlay
            url='stoumont.png'
            bounds={[[-16384,-16384], [32768,32768]]}
          />
          {/* <HeatmapLayer
            minOpacity={0.25}
            points={this.state.frags}
            longitudeExtractor={m => m['victim_location'][0]}
            latitudeExtractor={m => 16384 - m['victim_location'][1]}
            intensityExtractor={m => 10}
          /> */}
        </Map>
        <div className="" style={{margin: 16}}>
          <AsyncSelect
            id='map_ids'
            cacheOptions
            isMulti
            defaultOptions
            loadOptions={mapOptions}
            onChange={(value, action) => {
              let maps = value.map(x => x.label)
              this.setState({maps}, () => {
                // this.fetchHistogram()
              })
            }}
          />
        </div>
        <div className="" style={{margin: 16}}>
          <AsyncSelect
            id='damage_type_ids'
            cacheOptions
            isMulti
            defaultOptions
            loadOptions={damageTypeOptions}
            onChange={(value, action) => {
              let damageTypes = value.map(x => x.label)
              this.setState({damageTypes}, () => {
                this.fetchHistogram()
              })
            }}
          />
        </div>
        <div style={{width: 1024, height: 500}}>
          <Chart
            data={this.state.chartData}
          >
            <Axis primary type="linear" />
            <Axis type="linear" />
            <Series type={Line} />
          </Chart>
        </div>
        <div>
          <input id="normalize" type="checkbox" onChange={(event) => {
            this.setState({
              normalize: event.target.checked
              }, () => {
                this.updateChartData()
              })} } />
          <label for="normalize">Normalize</label>
        </div>
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
