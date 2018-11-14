import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import Players from './Players'
import Maps from './Maps'
import Player from './Player'
import Rounds from './Rounds'
import Round from './Round'
import MapComponent from './Map'

export default class Main extends React.Component {

    render() {
        return <main>
            <div className="container">
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/rounds/:id' component={Round} />
                    <Route exact path='/rounds' component={Rounds} />
                    <Route path='/players/:id' component={Player} />
                    <Route exact path='/players' component={Players} />
                    <Route exact path='/maps' component={Maps} />
                    <Route exact path='/maps/:id' component={MapComponent} />
                    {/* <Route path='/weapons' component={Weapons} /> */}
                </Switch>
            </div>
        </main>
    }
}