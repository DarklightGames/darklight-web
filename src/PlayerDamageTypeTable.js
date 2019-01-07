import React from 'react'
import Api from './api';
import ReactTable from 'react-table'
import api from './api';

export default class PlayerDamageTypeTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            padges: 0,
            loading: false,
        }
    }

    componentWillReceiveProps(newProps) {
    }

    requestData(pageSize, page, sorted, filtered) {
        let scope = this
        this.setState({
          loading: true,
        })
        return new Promise((resolve, reject) => {
            api.get(`players/damage_type_kills/`, {
                killer_id: this.props.playerId,
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
            defaultPageSize={10}
            columns={[
                {
                Header: 'damage_type_id',
                accessor: 'damage_type_id'
                },
                {
                Header: 'kills',
                accessor: 'kills'
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
    }
}