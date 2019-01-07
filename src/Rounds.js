import React from 'react'
import RoundsTable from './RoundsTable'

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