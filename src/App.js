import React, { Component } from 'react';
import ReactTable from 'react-table'
import logo from './logo.svg';

import './App.css';
import "react-table/react-table.css";

class Api {
  constructor(host) {
    this.host = host
  }

  get(path, params=null) {
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

  render() {
    return (
      <div className="App">
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
