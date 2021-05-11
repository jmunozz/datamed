/* eslint no-magic-numbers: 0 */
import React, {Component} from 'react';

import {SearchBar} from '../lib';
import {Accordion} from "../lib"


const opts = new Array(100000).fill({label: "jordan", value: 1, type: "spécialité" })

class App extends Component {
    constructor() {
        super();
        this.state = {
            props: {}
        };
        this.setProps = this.setProps.bind(this);
    }

    setProps(newProps) {
        this.setState({ props: newProps });
    }

    render() {

        const label = "Ceci est un label"
        return (
            // <div style={{height: '100%', width:"100%", display: "flex", justifyContent: "center", verticalAlign: "center", backgroundColor: 'green'}}>
            //     <SearchBar setProps={this.setProps} opts={opts} fireOnSelect={true} />
            //     <div>{JSON.stringify(this.state.props)}</div>
            // </div >
            <div>
                <Accordion id="accordion-id" label={label} isOpenOnFirstRender={true}>
                    <p>This is a text</p>
                </Accordion>
            </div>
        );
    }
}

export default App;
