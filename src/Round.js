import React from 'react'
import api from './api.js'
import ReactTable from 'react-table'
import Select from 'react-select'
import 'react-placeholder/lib/reactPlaceholder.css'
import moment from 'moment'
import RoundPlayerSummary from './RoundPlayerSummary'
import TeamIcon from './components/TeamIcon'
import AsyncSelect from 'react-select/lib/Async'
import Communication from './components/Communication'
import { sortedToOrdering, filteredToFilters } from './Helpers.js'
var momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment)


// TODO: probably need to put this somewhere for re-use!
let damageTypeOptions = inputValue => {
    return new Promise(resolve => {
        api.get('damage-types/', { search: inputValue, limit: 1000 }).then(response => response.json())
            .then(response => {
                resolve(response.results.map(x => ({ label: x.id, value: x.id })))
            })
    })
}

class RoundFragTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            pages: 0,
            loading: false,
            pageSize: 10
        }
    }

    playerOptions = (inputValue) => {
        return new Promise(resolve => {
            api.get(`rounds/${this.props.roundId}/players`, { search: inputValue }).then(response => response.json())
                .then(response => {
                    resolve(response.results.map(x => ({ label: x.names[0].name, value: x.id })))
                })
        })
    }

    requestData(pageSize, page, sorted, filtered) {
        let order_by = sortedToOrdering(sorted)
        let filters = filteredToFilters(filtered)
        this.setState({loading: true})
        return new Promise((resolve, reject) => {
            api.get(`rounds/${this.props.roundId}/frags`, {
                limit: pageSize,
                offset: page * pageSize,
                order_by, // TODO: fix this!
                ...filters
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
                getTheadFilterThProps={(state, rowInfo, column) => {
                    return {
                        style: { overflow: 'visible' }
                    }
                }}
                defaultPageSize={10}
                filterable
                sortable
                columns={[
                    {
                        Header: 'Killer',
                        accessor: 'killer',
                        sortable: false,
                        Cell: row => (
                            <div>
                                <TeamIcon teamIndex={row.value.team} />
                                <a href={`/players/${row.value.id}`}>
                                    {row.value.name}
                                </a>
                            </div>
                        ),
                        Filter: ({ filter, onChange }) => 
                            <AsyncSelect
                                isClearable
                                id='killer_id'
                                isSearchable
                                cacheOptions
                                defaultOptions
                                loadOptions={this.playerOptions}
                                onChange={(value, action) => {
                                    onChange(value)
                                }}
                            />
                    },
                    {
                        Header: 'Damage Type',
                        accessor: 'damage_type_id',
                        sortable: false,
                        Filter: ({ filter, onChange }) => 
                            <AsyncSelect
                                id='damage_type_id'
                                isClearable
                                cacheOptions
                                defaultOptions
                                loadOptions={damageTypeOptions}
                                onChange={(value, action) => {
                                    onChange(value)
                                }}
                            />
                    },
                    {
                        Header: 'Victim',
                        accessor: 'victim',
                        sortable: false,
                        Cell: row => (
                            <div>
                                <TeamIcon teamIndex={row.value.team} />
                                <a href={`/players/${row.value.id}`}>
                                    {row.value.name}
                                </a>
                            </div>
                        ),
                        Filter: ({ filter, onChange }) => 
                            <AsyncSelect
                                id='victim_id'
                                isClearable
                                cacheOptions
                                defaultOptions
                                loadOptions={this.playerOptions}
                                onChange={(value, action) => {
                                    onChange(value)
                                }}
                            />
                    },
                    {
                    Header: 'Distance',
                    accessor: 'distance',
                    filterable: false,
                    Cell: row => (
                        <div>
                            {`${Math.ceil(row.value / 60.352)}m`}
                        </div>
                    )
                    },
                    {
                        Header: 'Time',
                        accessor: 'time',
                        filterable: false,
                        Cell: row => (
                            <div>
                                {moment.duration(row.value, 'seconds').format()}
                            </div>
                        )
                    }
                ]}
                manual
                className="-striped -highlight"
                data={this.state.data}
                pages={this.state.pages}
                loading={this.state.loading}
                onFetchData={this.fetchData.bind(this)}
            />
        </div>
    }
}

class RallyPointTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: false,
            sorted: false,
            filtered: false
        }
    }

    requestData() {
        this.setState({
            loading: true,
        })
        return new Promise((resolve, reject) => {
            api.get(`rally-points`, {
                limit: 1000,
                offset: 0,
                round: this.props.roundId
            }).then(response => response.json())
                .then(data => {
                    const res = {
                        rows: data.results
                    }
                    resolve(res)
                })
        })
    }

    fetchData(state, instance) {
        this.requestData().then(res => {
            this.setState({
                data: res.rows,
                loading: false
            })
        })
    }

    componentWillMount() {
        this.fetchData()
    }

    getUniquePlayers() {
        let players = {}
        this.state.data.forEach(x => {
            if (!(x.player.id in players)) {
                players[x.player.id] = x.player
            }
        })
        let uniquePlayers =  Object.values(players).map(x => {
            return { value: x.id, label: x.name }
        })
        return uniquePlayers
    }

    render() {
        return <div>
            <ReactTable
                getTheadFilterThProps={(state, rowInfo, column) => {
                    return {
                        style: { overflow: 'visible' }
                    }
                }}
                defaultPageSize={10}
                columns={[
                    {
                        Header: 'Team',
                        accessor: 'team_index',
                        filterable: false,
                        Cell: row => (
                            <TeamIcon teamIndex={row.value} />
                        )
                    },
                    {
                        Header: 'Player',
                        accessor: 'player',
                        filterMethod: (filter, row) => {
                            return filter.value === null || row.player.id === filter.value.value
                        },
                        Filter: ({ filter, onChange }) => (
                            <Select
                                isClearable
                                defaultValue={null}
                                options={this.getUniquePlayers()}
                                onChange={(value, action) => {
                                    onChange(value)
                                }}
                            />
                        ),
                        sortMethod: (a, b, desc) => {
                            return a.id < b.id
                        },
                        Cell: row => (
                            <div>
                                <a href={`/players/${row.value.id}`}>
                                    {row.value.name}
                                </a>
                            </div>)
                    },
                    {
                        Header: 'Squad',
                        accessor: 'squad_index',
                        filterable: false,
                        Cell: row => (
                            <div>{row.value + 1}</div>
                        )
                    },
                    {
                        id: 'spawn_count',
                        Header: 'Spawns',
                        accessor: 'spawn_count',
                        filterable: false
                    },
                    {
                        id: 'lifespan',
                        Header: 'Lifespan',
                        accessor: x => moment.duration(x.lifespan),
                        filterable: false,
                        Cell: row => (
                            row.value.format()
                        )
                    },
                    {
                        Header: 'Destroyed By',
                        accessor: 'destroyed_reason',
                        filterable: false,
                    },
                ]}
                // manual
                filterable
                sortable={true}
                data={this.state.data}
                loading={this.state.loading}
                className="-striped -highlight"
                showPaginationTop={true}
                showPageSizeOptions={true}
            />
        </div>
    }
}


class RoundScoreboardTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: false,
            sorted: false,
            filtered: false
        }
    }

    requestData() {
        this.setState({
            loading: true,
        })
        return new Promise((resolve, reject) => {
            api.get(`rounds/${this.props.roundId}/scoreboard`, {
                limit: 1000,
                offset: 0
            }).then(response => response.json())
                .then(data => {
                    const res = {
                        rows: data.results
                    }
                    resolve(res)
                })
        })
    }

    fetchData(state, instance) {
        this.requestData().then(res => {
            this.setState({
                data: res.rows,
                loading: false
            })
        })
    }

    componentWillMount() {
        this.fetchData()
    }

    render() {
        return <div>
            <ReactTable
                SubComponent={row => {
                    return <RoundPlayerSummary
                        roundId={this.props.roundId}
                        playerId={row.original.player.id}
                    />
                }}
                defaultPageSize={15}
                columns={[
                    {
                        Header: 'Name',
                        accessor: 'player',
                        sortMethod: (a, b, desc) => {
                            return desc ? a.name < b.name : b.name < a.name
                        },
                        Cell: row => (
                            <div>
                                <a href={`/players/${row.value.id}`}>
                                    {row.value.name}
                                </a>
                            </div>)
                    },
                    {
                        id: 'kills',
                        Header: 'K',
                        accessor: 'kills'
                    },
                    {
                        Header: 'D',
                        accessor: 'deaths'
                    },
                    {
                        Header: 'TK',
                        accessor: 'tks'
                    },
                    {
                        Header: 'K:D',
                        accessor: 'kd',
                        Cell: row => (
                            <div>
                                {row.value && row.value.toFixed(1)}
                            </div>
                        )
                    }
                ]}
                data={this.state.data}
                loading={this.state.loading}
                className="-striped -highlight"
                showPaginationTop={true}
                showPageSizeOptions={true}
                sortable={true}
                defaultSorted={[{
                    id: 'kills',
                    desc: true
                }]}
            />
        </div>
    }
}

export default class Round extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            round: null
        }
        this.fetchRound()
    }


    fetchRound() {
        api.get(`rounds/${this.props.match.params.id}/`)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    round: response
                })
            })
    }

    getWinnerString(winner) {
        if (winner === -1) {
            return 'N/A'
        } else if (winner === 0) {
            return 'Axis'
        } else if (winner === 1) {
            return 'Allies'
        } else if (winner === 2) {
            return 'Draw'
        }
    }

    render() {
        return <div>
            <h1>Round #{this.props.match.params.id}</h1>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                {this.state.round &&
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Map</b>
                                    </td>
                                    <td>
                                        <a href={`/maps/${this.state.round.map}/`}>{this.state.round.map}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Version</b>
                                    </td>
                                    <td>
                                        {this.state.round.version}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Date</b>
                                    </td>
                                    <td>
                                        {moment(this.state.round.started_at).format('LLLL')}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Duration</b>
                                    </td>
                                    <td>
                                        {moment.duration(moment(this.state.round.ended_at).diff(moment(this.state.round.started_at))).format()}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Winner</b>
                                    </td>
                                    <td>
                                        <TeamIcon teamIndex={this.state.round.winner}/> {this.getWinnerString(this.state.round.winner)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Log ID</b>
                                    </td>
                                    <td>
                                        {this.state.round.log.id}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                }
                <div>
                </div>
            </div>
            <h1>
                Scoreboard
            </h1>
            <RoundScoreboardTable
                roundId={this.props.match.params.id}
            />
            <h1>
                Frags
            </h1>
            <RoundFragTable
                roundId={this.props.match.params.id}
            />
            <h1>
                Rally Points
            </h1>
            <RallyPointTable
                roundId={this.props.match.params.id}
            />
            <h1>
                Communication
            </h1>
            {this.state.round &&
                <Communication logId={this.state.round.log.id} />
            }
        </div>
    }
}