import React from 'react'
import AsyncReactTable from 'react-table'
import api from './api.js'
import moment from 'moment'
import { sortedToOrdering } from './Helpers.js'

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
        this.setState({
          loading: true,
        })
        let ordering = sortedToOrdering(sorted)
        return new Promise((resolve, reject) => {
          api.get('players', {
            limit: pageSize,
            offset: page * pageSize,
            ordering
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
        return <AsyncReactTable
            columns={[
                {
                    Header: 'Name',
                    accessor: 'names',
                    sortable: false,
                    Cell: row => (
                        <span title={`${row.value.map(x => x.name).join(', ')}`}>
                            <a href={`/players/${row.original.id}`}>
                                {row.value[0].name}
                            </a>
                        </span>
                    )
                },
                {
                    Header: 'K',
                    accessor: 'kills'
                },
                {
                    Header: 'D',
                    accessor: 'deaths'
                },
                {
                    Header: 'K:D',
                    sortable: false,
                    Cell: row => (
                        <span>
                            {(row.original.kills / row.original.deaths).toFixed(2)}
                        </span>
                    )
                },
                {
                    Header: 'TK',
                    accessor: 'ff_kills',
                    Cell: row => (
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>
                                {row.value}
                            </span>
                            <span style={{fontSize: '0.75rem'}}>
                                {(row.value / row.original.kills * 100.0).toFixed(2)}%
                            </span>
                        </div>
                    )
                },
                {
                    Header: 'Playtime',
                    accessor: 'playtime',
                    Cell: row => (
                        <span>
                            {moment.duration(row.value).humanize()}
                        </span>
                    )
                },
            ]}
            manual
            sortable={true}
            defaultSorted={[
                {
                    id: 'kills',
                    desc: true
                }
            ]}
            data={this.state.data}
            pages={this.state.pages}
            loading={this.state.loading}
            onFetchData={this.fetchData.bind(this)}
            className="-striped -highlight"
            showPaginationTop={true}
            showPageSizeOptions={true}
            defaultPageSize={25}
        />
    }
}

export default class Players extends React.Component {

    render() {
        return <div>
            <h1>Players</h1>
            <PlayersTable />
        </div>
    }
}