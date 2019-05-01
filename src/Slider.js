import React from 'react';
import './Slider.scss';

export default class Slider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			simulating: false,
			dragging: false,
		};
	}

	handleMouseDownOnDot() {
		this.setState({dragging: true});
	}

	handleMouseDownOnLine(event) {
		const minPixel = this.sliderBar.getBoundingClientRect().left;
		const widthPixel = this.sliderBar.getBoundingClientRect().width;

		const newValue = (event.clientX - minPixel) / widthPixel;
		this.changeValue(newValue);
	}

	mousemoveListener(event) {
		if (this.state.dragging) {
			const minPixel = this.sliderBar.getBoundingClientRect().left;
			const widthPixel = this.sliderBar.getBoundingClientRect().width;

			const newValue = (event.clientX - minPixel) / widthPixel;
			this.changeValue(newValue);
			event.preventDefault();
  			event.stopPropagation();
		}
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
		this.changeValue(this.props.value - 0.01);
	}

	increaseIndex() {
		this.changeValue(this.props.value + 0.01);
	}

	changeValue(newValue) {
		const correctedValue = Math.min(1, Math.max(0, newValue));
		if (correctedValue !== this.props.value) {
			this.props.onChange(correctedValue);
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
			if (this.props.value < 1) {
				this.changeValue(this.props.value + 0.01);
				setTimeout(() => this.simulateStep(), 100);
			} else {
				this.setState({simulating: false});
			}
		}
	}

	stopSimulation() {
	}

	render() {
		return (
			<div className={'slider-container'}>
				<div className={'controls'}>
		          	<div className={'control'} onClick={() => this.decreaseIndex()}>{'<'}</div>
					<div className={'control'} onClick={() => this.triggerSimulation()}>
						{this.state.simulating ? 'pause' : 'play'}
					</div>
		          	<div className={'control'} onClick={() => this.increaseIndex()}>{'>'}</div>
				</div>
	        	<div className={'slider'}>
					<div
						className={'slider-line'}
						ref={bar => { this.sliderBar = bar; }}
						onMouseDown={event => this.handleMouseDownOnLine(event)}
					>
						<div
							className={'slider-position'}
							style={{left: `${100 * this.props.value}%`}}
						>
							<div
								className={'slider-dot'}
								onMouseDown={event => this.handleMouseDownOnDot(event)}
							/>
						</div>
					</div>
		        </div>
		        <div className={'slider-value'}>
		        	{Math.round(100 * this.props.value)}
		        </div>
		    </div>
		);
	}
}