import React, { Link } from 'react'
import ReactTable from 'react-table'
import api from './api.js'
import moment from 'moment'

class RoundsTable extends React.Component {

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
          api.get('rounds', {
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
                Header: 'ID',
                accessor: 'id',
                Cell: row => (
                    <div>
                        <a href={`/rounds/${row.value}`}>
                            {row.value}
                        </a>
                    </div>)
                },
                {
                    Header: 'Version',
                    accessor: 'version'
                },
                {
                    Header: 'Map',
                    accessor: 'map_id'
                },
                {
                    Header: 'Date',
                    accessor: 'started_at'
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

export default class Rounds extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div>
            <h1>Rounds</h1>
            <RoundsTable />
        </div>
    }
}