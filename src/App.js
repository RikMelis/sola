import React from 'react';
import Strecke from './Strecke.js';
import {strecken as streckenData} from './database.js';
import './App.scss';

export const UNCERTAINTY_RATE = 0.15;

const addTimesToStrecken = strecken => {
    strecken.forEach((strecke, index) => {
        if ('newStart' in strecke) {
            strecke.timeOffset = strecke.newStart;
            strecke.uncertaintyInterval = 0
        } else {
            const prevStrecke = strecken[index - 1];
            strecke.timeOffset = prevStrecke.timeOffset + prevStrecke.pace * prevStrecke.distance;

            strecke.uncertaintyInterval = prevStrecke.uncertaintyInterval
            if (prevStrecke.isEstimate) {
                // 10 percent uncertainty
                strecke.uncertaintyInterval += UNCERTAINTY_RATE * prevStrecke.pace * prevStrecke.distance
            }
        }
    })
    return strecken;
}

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            streckeID: 0,
            strecken: streckenData,
            positionID: 0,
            live: false,
        };

        this.pollData();
    }

    pollData() {
        this.reloadData();
        // reload every minute
        setTimeout(() => this.pollData(), 60000);
    }

    recalculateStreckenTimes() {
        this.setState({
            strecken: addTimesToStrecken(this.state.strecken),
        })
    }

    reloadData() {
        const options = {
            method: 'GET',
            url: 'https://sola2019-461b.restdb.io/rest/strecken',
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': '5ccb5a18aa6d1c0bac8c93bd' 
            },
        };

        const request = require('request');

        request(options, (error, response, body) => {
            if (error) throw new Error(error);

            JSON.parse(body).forEach(d => {
                const strecke = this.state.strecken.find(s => s.lookupIndex === d.name);
                strecke._id = d._id;
                strecke.pace = d.pace;
                strecke.isEstimate = d.estimation;
            });

            this.recalculateStreckenTimes();
        });
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

        if (!live || (positionID === 1000 && streckeID === strecken.length - 1)) {
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
                {false && <div
                    className={'live-button'}
                    onClick={() => this.triggerLive()}
                    style={{backgroundColor: this.state.live ? '#ffcc00' : 'white'}}
                    >
                    {this.state.live ? 'LIVE' : 'go live'}
                </div>}
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
                            style={{
                                backgroundColor: index === this.state.streckeID ? 'lightgrey' : 'white',
                                fontSize: index === this.state.streckeID ? '24px' : '12px'
                            }}
                        >
                            {strecke.name}
                        </div>
                    )}
                </div>
                <Strecke
                    key={`${this.state.streckeID}`}
                    strecke={this.state.strecken[this.state.streckeID]}
                    positionID={this.state.positionID}
                    changePositionID={id => this.setState({live: false, positionID: id})}
                    recalculateStreckenTimes={() => this.recalculateStreckenTimes()}
                />
            </div>
        );
    }
}
