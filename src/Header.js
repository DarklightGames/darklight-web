import React from 'react'
import AsyncSelect from 'react-select/lib/Async'
import api from './api.js'

export default class Header extends React.Component {

    render() {
        return <header>
            <div className="container">
                <a href="/">
                    <img src="/logo.png" height="42" width="42" style={{float: "left", paddingRight: 16}} />
                </a>
                <div style={{width: 386, float: "left"}}>
                    <AsyncSelect
                        styles={{
                            backgroundColor: 'red',
                        }}
                        cacheOptions
                        placeholder="Search player by name or ROID..."
                        loadOptions={(inputValue) => {
                            return new Promise((resolve, reject) => {
                                api.get('players', {
                                limit: 10,
                                offset: 0,
                                search: inputValue
                                }).then(response => response.json())
                                .then(data => {
                                    let results = data.results.map(x => ({
                                        value: x.id,
                                        label: x.names[0].name
                                    }))
                                    console.log(results)
                                    resolve(results)
                                })
                            })
                            }
                        }
                        onChange={(value) => {
                            window.location.href = '/players/' + value.value
                        }}
                    />
                </div>
                <ul>
                    <li>
                        <a href="/players/">Players</a>
                    </li>
                    <li>
                        <a href="/rounds/">Rounds</a>
                    </li>
                    <li>
                        <a href="/maps/">Maps</a>
                    </li>
                    <li>
                        <a href="/weapons/">Weapons</a>
                    </li>
                </ul>
            </div>
        </header>
    }
}