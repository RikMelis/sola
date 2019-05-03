import React from 'react';
import Profile from './Profile.js';
import {UNCERTAINTY_RATE} from './App.js'
import './Slider.scss';

function convertMinsToClock(mins) {
    let h = Math.floor(mins / 60);
    let m = Math.floor(mins % 60);
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m}`;
}

export const convertMinsToHrsMins = (mins) => {
    let h = Math.floor(mins / 60);
    let m = Math.floor(mins % 60);
    if (h > 0) {
    	return `${h}h ${m}min`;
    }
    return `${m}min`;
}

export default class Slider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			simulating: false,
			dragging: false,
		};
	}

	componentWillUnmount() {
		if (this.simulationTimer) {
			clearTimeout(this.simulationTimer);
		}
	}

	handleMouseDownOnDot(event) {
		this.move(event);
		this.setState({dragging: true});
	}

	mousemoveListener(event) {
		if (this.state.dragging) {
			this.move(event);
		}
	}

	move(event) {
		const minPixel = this.sliderLine.getBoundingClientRect().left;
		const widthPixel = this.sliderLine.getBoundingClientRect().width;

		const newValue = 1000 * (event.clientX - minPixel) / widthPixel;
		this.changeValue(newValue);
		event.preventDefault();
		event.stopPropagation();
	}

	mouseupListener() {
		if (this.state.dragging) {
			this.setState({dragging: false});
		}
	}

	componentDidMount() {
  		document.addEventListener('mousemove', this.mousemoveListener.bind(this), true);
		document.addEventListener('mouseup', this.mouseupListener.bind(this), true);
	}

	decreaseIndex() {
		this.changeValue(this.props.value - 10);
	}

	increaseIndex() {
		this.changeValue(this.props.value + 10);
	}

	changeValue(newValue) {
		const correctedValue = Math.min(1000, Math.max(0, Math.round(newValue)));
		if (correctedValue !== this.props.value) {
			this.props.changePositionID(correctedValue);
		}
	}

	triggerSimulation() {
		if (this.state.simulating) {
			this.setState({simulating: false});
		} else {
			this.setState(
				{simulating: true},
				this.simulateStep
			);
		}
	}

	simulateStep() {
		if (this.state.simulating) {
			if (this.props.value < 1000) {
				this.changeValue(this.props.value + 1);
				this.simulationTimer = setTimeout(() => this.simulateStep(), 10);
			} else {
				this.setState({simulating: false});
			}
		}
	}

	render() {
		const {
			value,
			strecke,
			currentPosition
		} = this.props;

		const {
			distance,
			pace,
			timeOffset,
			isEstimate,
		} = strecke;

		const currentGradient = Math.round(currentPosition.grad / 10);

		let uncertaintyInterval = strecke.uncertaintyInterval;
		if (isEstimate) {
			uncertaintyInterval += UNCERTAINTY_RATE * pace * currentPosition['dis'];
		}

		return (
			<div className={'slider-container'}>
				<div
					className={'profile-slider'}
					ref={bar => { this.sliderLine = bar; }}
					onMouseDown={event => this.handleMouseDownOnDot(event)}
					>
	                <Profile strecke={strecke} sliderLineRef={this.sliderLine}/>
					<div
						className={'slider-position'}
						style={{left: `${value / 10}%`}}
					>
						<div className={'slider-value'}>
				        	<div>{`${(value * distance / 1000).toFixed(2)} km`}</div>
				        	<div>
				        		{convertMinsToClock(timeOffset + pace * currentPosition['dis'])}
				        		{` (± ${convertMinsToHrsMins(uncertaintyInterval)})`}

				        	</div>
				        	<div>
				        		{`↕ ${Math.round(currentPosition['alt'])} m`}
				        		{` (${currentGradient}%)`}
				        	</div>
				        </div>
				    </div>
			    </div>
				<div className={'controls'}>
		          	<div className={'control'} onClick={() => this.decreaseIndex()}>{'<'}</div>
					<div className={'control'} onClick={() => this.triggerSimulation()}>
						{this.state.simulating ? 'pause' : 'play'}
					</div>
		          	<div className={'control'} onClick={() => this.increaseIndex()}>{'>'}</div>
				</div>
		    </div>
		);
	}
}