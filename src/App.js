import React from 'react';
import Strecke from './Strecke.js';
import {strecken} from './database.js';
import './App.scss';

const addTimesToStrecken = strecken => {
    strecken.forEach((strecke, index) => {
        if ('newStart' in strecke) {
            strecke.timeOffset = strecke.newStart;
        } else {
            strecke.timeOffset = strecken[index - 1].timeOffset + strecke.pace * strecke.distance;
        }
    })
    return strecken;
}

export default class App extends React.Component {
    constructor(props) {
        super(props);

        addTimesToStrecken(strecken)

        this.state = {
            streckeID: 0,
            strecken: strecken,
        };
    }

    render() {
        return (
            <div className={'app'}>
                <div className={'app-title'}>SOLA 2019</div>
                <div className={'strecke-selector'}>
                    {this.state.strecken.map((strecke, index) => 
                        <div
                            key={`strecke-button-${strecke.lookupIndex}`}
                            className={'strecke-button'}
                            onClick={() => this.setState({streckeID: index})}
                            style={{backgroundColor: index === this.state.streckeID ? 'grey' : 'white'}}
                        >
                            {strecke.name}
                        </div>
                    )}
                </div>
                <Strecke
                    key={`strecke-${this.state.streckeID}`}
                    strecke={this.state.strecken[this.state.streckeID]}
                />
            </div>
        );
    }
}
