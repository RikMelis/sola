import React from 'react';
import Slider, {convertMinsToHrsMins} from './Slider.js';
import MapWithRunner from './MapWithRunner.js';
import './Strecke.scss';

export default class Strecke extends React.Component {
    render() {
        const {
            strecke,
            positionID,
            changePositionID,
            recalculateStreckenTimes,
        } = this.props;

        const {
            runner, 
            track,
            stepToTrackIndex,
            pace,
            distance
        } = strecke;

        const currentPosition = track[stepToTrackIndex[positionID]];

        return (
            <div className={'strecke'}>
                {runner}
                <Pace strecke={strecke} recalculateStreckenTimes={recalculateStreckenTimes}/>
                <div>{convertMinsToHrsMins(pace * distance)}</div>
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

class Pace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editingValue: null,
            isValid: true,
        };
    }

    adjustPace(newValue) {
        this.props.strecke.pace = newValue;
        this.props.recalculateStreckenTimes();

        const request = require('request');

        const options = { 
            method: 'PUT',
            url: `https://sola2019-461b.restdb.io/rest/strecken/${this.props.strecke._id}`,
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': '5ccb5a18aa6d1c0bac8c93bd',
                'content-type': 'application/json'
            },
            body: { pace: newValue },
            json: true,
        };

        request(options, (error, response, body) => {
            if (error) throw new Error(error);
        });
    }

    onChangePaceValue(event) {
        const newValue = event.target.value;

        const isValidExp = new RegExp('^[3-7](.[0-9][0-9]?)?$')

        this.setState({
            editingValue: newValue,
            isValid: isValidExp.test(newValue),
        });
    }

    render() {
        const {
            editingValue,
            isValid,
        } = this.state;

        if (editingValue !== null) {
            return (
                <div className={'pace'}>
                    <input type={'number'} step={0.1} min={3} max={7.99} value={editingValue}
                            onChange={event => this.onChangePaceValue(event)}/>
                    {' min/km'}
                    <div
                        className={'button'}
                        onClick={() => {
                            if (isValid) {
                                this.adjustPace(editingValue);
                                this.setState({editingValue: null});
                            }
                        }}
                        style={{
                            'cursor': isValid ? 'pointer' : 'not-allowed',
                            'opacity': isValid ? 1 : 0.3,
                        }}
                        >
                        <img className={'confirm'} alt={'confirm'} src={require('./confirm.png')}/>
                    </div>
                </div>
            );
        }

        const {
            pace,
        } = this.props.strecke;

        return (
            <div className={'pace'}>
                {`${pace} min/km`}
                <div
                    className={'button'}
                    onClick={() => this.setState({editingValue: pace})}
                    >
                    <img className={'pencil'} alt={'pencil'} src={require('./pencil.png')}/>
                </div>
            </div>
        );
    }
}
