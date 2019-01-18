import React from 'react'
import api from './api.js'
import ReactTable from 'react-table'
import 'react-placeholder/lib/reactPlaceholder.css'
import moment from 'moment'


class RoundScoreboardTable extends React.Component {

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
        return new Promise((resolve, reject) => {
            api.get(`rounds/${this.props.roundId}/scoreboard`, {
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
                        accessor: 'player',
                        Cell: row => (
                            <div>
                                <a href={`/players/${row.value.id}`}>
                                    {row.value.name}
                                </a>
                            </div>)
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
            {this.state.round &&
                <div>
                    <table>
                        <tr>
                            <td>
                                Map
                            </td>
                            <td>
                                <a href={`/maps/${this.state.round.map}/`}>{this.state.round.map}</a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Version
                            </td>
                            <td>
                                {this.state.round.version}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Date
                            </td>
                            <td>
                                {moment(this.state.round.started_at).format('LLLL')}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Duration
                            </td>
                            <td>
                                {
                                    moment.duration(moment(this.state.round.ended_at).diff(moment(this.state.round.started_at))).humanize()
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Winner
                            </td>
                            <td>
                                {this.getWinnerString(this.state.round.winner)}
                            </td>
                        </tr>
                    </table>
                </div>
            }
            <h1>
                Scoreboard
            </h1>
            <RoundScoreboardTable
                roundId={this.props.match.params.id}
            />
        </div>
    }
}