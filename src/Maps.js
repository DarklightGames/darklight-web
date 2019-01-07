import React from 'react'
import api from './api.js'
import PlayerDamageTypeTable from './PlayerDamageTypeTable.js'
import ReactTable from 'react-table'
import 'react-placeholder/lib/reactPlaceholder.css'


class MapsTable extends React.Component {

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
            api.get(`maps`, {
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
        return <div>
            <ReactTable
                defaultPageSize={20}
                columns={[
                    {
                    Header: 'Name',
                    accessor: 'name',
                    Cell: row => (
                        <div>
                            <a href={`/maps/${row.value}`}>
                                {row.value}
                            </a>
                        </div>)
                    },
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
        </div>
    }
}

export default class Maps extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div>
            <MapsTable
            />
            </div>
    }
}
