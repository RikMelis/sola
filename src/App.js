import React from 'react';
import Strecke from './Strecke.js';
import {strecken} from './database.js';
import './App.scss';

const addTimesToStrecken = strecken => {
    strecken.forEach((strecke, index) => {
        if ('newStart' in strecke) {
            strecke.timeOffset = strecke.newStart;
        } else {
            const prevStrecke = strecken[index - 1];
            strecke.timeOffset = prevStrecke.timeOffset + prevStrecke.pace * prevStrecke.distance;
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
            positionID: 0,
            live: false,
        };
    }

    triggerLive() {
        if (this.state.live) {
            this.stopLive();
        } else {
            this.goLive();
        }
    }

    stopLive() {
        this.setState({
            live: false,
        });
    }

    goLive() {
        const now = 9 * 60;

        let streckeID = this.state.strecken.length - 1;
        while (this.state.strecken[streckeID].timeOffset > now) {
            streckeID -= 1
        }

        if (streckeID < 0) {
            console.log('too early');
        }

        const {
            timeOffset,
            pace,
            distance,
        } = this.state.strecken[streckeID]

        const positionID = Math.floor((now - timeOffset) / pace / distance * 1000)

        this.setState({
            live: true,
            streckeID: streckeID,
            positionID: positionID,
        }, this.liveStep);
    }

    liveStep() {
        const {
            live,
            strecken,
            streckeID,
            positionID,
        } = this.state;

        if (!this.state.live || (positionID === 1000 && streckeID === strecken.length - 1)) {
            this.stopLive();
        } else if (positionID === 1000) {
                this.setState({
                    streckeID: streckeID + 1,
                    positionID: 0,
                }, this.liveStep)
        } else {
            const timeInterval = strecken[streckeID].distance / 1000 * strecken[streckeID].pace * 60 * 1000;
            this.setState({positionID: positionID + 1});
            setTimeout(() => this.liveStep(), timeInterval);
        }
    }

    render() {
        return (
            <div className={'app'}>
                <div className={'app-title'}>SOLA 2019</div>
                <div
                    className={'live-button'}
                    onClick={() => this.triggerLive()}
                    style={{backgroundColor: this.state.live ? '#ffcc00' : 'white'}}
                    >
                    {this.state.live ? 'LIVE' : 'go live'}
                </div>
                <div className={'strecke-selector'}>
                    {this.state.strecken.map((strecke, index) => 
                        <div
                            key={`strecke-button-${strecke.lookupIndex}`}
                            className={'strecke-button'}
                            onClick={() => this.setState({
                                streckeID: index,
                                positionID: 0,
                                live: false,
                            })}
                            style={{backgroundColor: index === this.state.streckeID ? 'grey' : 'white'}}
                        >
                            {strecke.name}
                        </div>
                    )}
                </div>
                <Strecke
                    strecke={this.state.strecken[this.state.streckeID]}
                    positionID={this.state.positionID}
                    changePositionID={id => this.setState({live: false, positionID: id})}
                />
            </div>
        );
    }
}
