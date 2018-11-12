import React, { Link } from 'react'
import { Switch, Route } from 'react-router-dom'
import ReactTable from 'react-table'
import api from './api.js'

class PlayersTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: false,
            pages: 0,
            page: 0,
            pageSize: 25,
            sorted: false,
            filtered: false
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
        return <ReactTable
            defaultPageSize={20}
            columns={[
                {
                Header: 'ROID',
                accessor: 'id',
                Cell: row => (
                    <div>
                        <a href={`/players/${row.value}`}>
                            {row.value}
                        </a>
                    </div>)
                },
                {
                Header: 'Name',
                accessor: 'names[0].name'
                },
                {
                Header: 'IP Address',
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
            showPageSizeOptions={false}
        />
    }
}

export default class Players extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div>
            <h1>Players</h1>
            <PlayersTable />
        </div>
    }
}