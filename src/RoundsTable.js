import React from 'react'
import ReactTable from 'react-table'
import api from './api.js'
import moment from 'moment'
import AsyncSelect from 'react-select/lib/Async'
import PropTypes from 'prop-types'
import TeamIcon from './components/TeamIcon'

const winnerOptions = [
    { value: '0', label: 'Axis' },
    { value: '1', label: 'Allies' },
    { value: '2', label: 'Draw' }
]

let mapOptions = inputValue => {
    return new Promise(resolve => {
        api.get('maps/', { search: inputValue, limit: 0 }).then(response => response.json())
            .then(response => {
                resolve(response.results.map(x => ({ label: x.name, value: x.name })))
            })
    })
}

export default class RoundsTable extends React.Component {

    static propTypes = {
        map: PropTypes.string,
        defaultPageSize: PropTypes.number
    }

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: false,
            pages: 0,
            page: 0,
            pageSize: this.props.defaultPageSize,
            sorted: false,
            filter: {
                winner: null,
                map: this.props.map
            }
        }
    }

    requestData(pageSize, page, sort, filter) {
        this.setState({
            loading: true,
        })
        return new Promise((resolve, reject) => {
            // let filters = Object.entries(this.state.filter).filter((entry) => entry[1] != null)
            let filters = this.state.filter
            filters = {
                ...Object.keys(filters)
                    .filter(key => filters[key] != null)
                    .reduce((newFilters, key) => {
                        return {
                            ...newFilters, [key]: filters[key]
                        }
                    }, {})
            }
            let params = {
                limit: pageSize,
                offset: page * pageSize,
                ...filters
            }
            // TODO: filter out null values in filter params
            api.get('rounds', params).then(response => response.json())
                .then(data => {
                    const res = {
                        rows: data.results,
                        pages: Math.ceil(data.count / pageSize)
                    }
                    resolve(res)
                })
        })
    }

    fetchData = (state, instance) => {
        this.requestData(
            state.pageSize,
            state.page,
            state.sort,
            state.filter
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
            {...this.props}
            getTheadFilterThProps={(state, rowInfo, column) => {
                return {
                    style: { overflow: 'visible' }
                }
            }}
            filterable={false}
            defaultPageSize={this.props.defaultPageSize}
            columns={[
                {
                    Header: 'ID',
                    accessor: 'id',
                    Cell: row => (
                        <div>
                            <a href={`/rounds/${row.value}`}>
                                {row.value}
                            </a>
                        </div>
                    ),
                    sortable: false,
                },
                {
                    Header: 'Version',
                    accessor: 'version',
                    sortable: false,
                },
                {
                    Header: 'Map',
                    accessor: 'map',
                    width: 300,
                    sortable: false,
                    Cell: row => (
                        <div>
                            <a href={`/maps/${row.value}`}>
                                {row.value}
                            </a>
                        </div>
                    )
                },
                {
                    Header: 'Date',
                    accessor: 'started_at',
                    width: 200,
                    sortable: false,
                    Cell: row => (
                        <div>
                            {moment(row.value).calendar()}
                        </div>
                    )
                },
                {
                    Header: 'Players',
                    accessor: 'num_players',
                    sortable: false,
                },
                {
                    Header: 'Kills',
                    accessor: 'num_kills',
                    sortable: false,
                },
                {
                    Header: 'Winner',
                    accessor: 'winner',
                    Cell: row => (
                        <TeamIcon teamIndex={row.value} />
                    ),
                    sortable: false,
                }
            ]}
            manual
            sortable
            data={this.state.data}
            pages={this.state.pages}
            loading={this.state.loading}
            onFetchData={this.fetchData}
            className="-striped -highlight"
            showPaginationTop={true}
            showPageSizeOptions={true}
        />
    }
}

RoundsTable.defaultProps = {
    map: null,
    defaultPageSize: 25
}
