import React, { Link } from 'react'
import { Switch, Route } from 'react-router-dom'
import ReactTable from 'react-table'
import api from './api.js'

export default class Reports extends React.Component {

    render() {
        return <div>
            <p>
                This is an aspirational list of reports that would be nice to have in the future.
            </p>
            <ul>
                <li>Squad Rally Points</li>
                <li>Players With Most Kills</li>
                <li>Highest Friendly Fire % Weapons</li>
            </ul>
        </div>
    }
}