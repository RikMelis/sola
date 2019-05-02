import React from 'react';
import Slider from './Slider.js';
import MapWithRunner from './MapWithRunner.js';
import './Strecke.scss';

export default class Strecke extends React.Component {
    render() {
        const {
            strecke,
            positionID,
            changePositionID,
        } = this.props;

        const {
            runner, 
            track,
            pace,
            stepToTrackIndex,
        } = strecke;

        const currentPosition = track[stepToTrackIndex[positionID]];

        return (
            <div className={'strecke'}>
                <div className={'strecke-title'}>
                    {`${runner} - ${pace} min/km`}
                </div>
                <Slider
                    value={positionID}
                    changePositionID={changePositionID}
                    strecke={strecke}
                    currentPosition={currentPosition}
                />
                <MapWithRunner currentPosition={currentPosition} strecke={strecke}/>
            </div>
        );
    }
}
