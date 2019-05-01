import React from 'react';
import Slider from './Slider.js';
import MapWithRunner from './MapWithRunner.js';
import './Strecke.scss';

function convertMinsToHrsMins(mins) {
    let h = Math.floor(mins / 60);
    let m = Math.round(mins % 60);
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m}`;
}

export default class Strecke extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
        };
    }

    render() {
        const {
            strecke,
        } = this.props;

        const {
            name,
            runner,
            track,
            distance,
            pace,
            timeOffset
        } = strecke;

        const positionIndex = Math.round(this.state.value * (track.length - 1));
        const currentPosition = track[positionIndex];

        const estimatedTime = timeOffset + pace * currentPosition['dis'];

        return (
            <div className={'strecke'}>
                <div className={'strecke-title'}>
                    {`Strecke ${name} - ${runner} - ${(distance / 1000).toFixed(2)} km - ${pace} min/km`}
                </div>
                <div className={'estimated-time'}>
                    {`Estimated Time: ${convertMinsToHrsMins(estimatedTime)}`}
                </div>
                <Slider
                    value={this.state.value}
                    onChange={value => this.setState({value: value})}
                />
                <MapWithRunner currentPosition={currentPosition} strecke={strecke}/>
                <div className={'profile'}>
                    {track.map((pos, index) => 
                        <div 
                            className={'pos'}
                            style={{height: `${pos.alt - 430}px`, backgroundColor: index === positionIndex ? 'red' : 'black'}}
                        />
                    )}
                </div>
            </div>
        );
    }
}
