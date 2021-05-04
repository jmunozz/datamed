/* eslint no-magic-numbers: 0 */
import React, {Component} from 'react';

import {SearchBar} from '../lib';


const opts = [
    {label: "jordan", value: 1, type: "spécialité" },
    {label: "jordan", value: 1, type: "spécialité" },
    {label: "jordan", value: 1, type: "spécialité" },
    {label: "japin", value: 2, type: "substance" },
    {label: "jordy", value: 2, type: "substance" },
    {label: "romain", value: 2, type: "substance" },
    {label: "romain", value: 2, type: "substance" },
    {label: "théo", value: 3, type: "spécialité" },
]

class App extends Component {
    constructor() {
        super();
        this.state = {
            value: '',
            opts,
        };
        this.setProps = this.setProps.bind(this);
    }

    setProps(newProps) {
        this.setState(newProps);
    }

    render() {
        return (
            <div style={{height: '100%', width:"100%", display: "flex", justifyContent: "center", verticalAlign: "center", backgroundColor: 'green'}}>
                <SearchBar setProps={this.setProps} {...this.state} />
                <div  />
            </div >
        );
    }
}

export default App;
