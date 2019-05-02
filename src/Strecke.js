import React from 'react';
import Slider from './Slider.js';
import MapWithRunner from './MapWithRunner.js';
import './Strecke.scss';

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
            runner, 
            track,
            distance,
            pace,
        } = strecke;

        const positionIndex = Math.round(this.state.value * (track.length - 1));
        const currentPosition = track[positionIndex];

        return (
            <div className={'strecke'}>
                <div className={'strecke-title'}>
                    {`${runner} - ${pace} min/km`}
                </div>
                <Slider
                    value={this.state.value}
                    onChange={value => this.setState({value: value})}
                    strecke={strecke}
                    currentPosition={currentPosition}
                />
                <MapWithRunner currentPosition={currentPosition} strecke={strecke}/>
            </div>
        );
    }
}
