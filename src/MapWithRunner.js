import React from 'react';
import './MapWithRunner.scss';

export default class MapWithRunner extends React.Component {
	render() {
		const {
			currentPosition,
			strecke,
		} = this.props;

		const {
			lookupIndex,
			swCorner,
			neCorner,
			profilePicture,
			runner,
		} = strecke;

		const currentRelativePosition = {
			x: (currentPosition.lat - swCorner.lat) / (neCorner.lat - swCorner.lat),
			y: (currentPosition.lon - swCorner.lon) / (neCorner.lon - swCorner.lon),
		}

		const currentPositionStyle = {
			bottom: `${currentRelativePosition.x * 100}%`,
			left: `${currentRelativePosition.y * 100}%`,
		};

		return (
			<div className={'map-container'}>
				<img className={'map'} src={require(`./maps/map${lookupIndex}.png`)} alt={'map'}/>
				<div className={'current-position'} style={currentPositionStyle}>
					<img 
						className={'runner'}
						src={profilePicture || require('./runner.png')}
						alt={'runner'}
					/>
				</div>
			</div>
		);
	}
}