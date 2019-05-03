import React from 'react';

export default class Profile extends React.Component {
	render() {
		const {
			strecke,
		} = this.props;

		const {
			track,
			distance,
		} = strecke;

		const {minAlt: minAltitude, maxAlt: maxAltitude} = track.reduce((d, t) => 
			({minAlt: Math.min(d.minAlt, t.alt), maxAlt: Math.max(d.maxAlt, t.alt)}),
			{minAlt: 1000, maxAlt: 0});


		const minY = minAltitude - 20;
		const maxY = maxAltitude;

		const yLabels = [minY, maxY];

		let i = 100 * Math.ceil(minY / 100);
		if (i - minY > 20) {
			yLabels.push(i);
		}
		i += 100;
		while (i < maxY - 20) {
			yLabels.push(i);
			i += 100;
		}

		return (
			<div>
				<svg height={`${maxY - minY}`} width={'700'} viewBox={`0 0 700 ${maxY - minY}`} preserveAspectRatio={'none'}>
					{track.slice(1).map((t, index) => {
						const dis1 = t.dis;
						const dis2 = track[index].dis;
						const x1 = dis1 * 700 / distance;
						const x2 = dis2 * 700 / distance;

						const alt1 = t.alt;
						const alt2 = track[index].alt

						const y1 = maxY - alt1;
						const y2 = maxY - alt2;

						let color = '#ffd9b3';
						const elevation = t.grad;
						if (elevation > 150) {
							color = '#800000';
						} else if (elevation > 100) {
							color = '#ff1a1a'
						} else if (elevation > 40) {
							color = 'orange';
						}

						return (
							<polygon
								key={index}
								points={`${x1},500 ${x2},500 ${x2},${y2} ${x1},${y1}`}
								style={{fill: color, stroke: color}}
							/>
						);
					})}
				</svg>
				<div className={'y-axis'}>
					{yLabels.map(y => 
						<div
							key={`y-${y}-point`}
							className={'y-point'}
							style={{top: `${maxY - y}px`}}
							>
							<div className={'y-line'}/>
							<div className={'y-label'}>
								{`${Math.round(y)} m`}
							</div>
						</div>
					)}
				</div>
				<div className={'km-axis'}>
					{Array.from(Array(Math.floor(distance + 0.6)).keys()).map(km => {
						const relativeX = km / distance;
						return (
							<div
								key={`km-${km}-point`}
								className={'km-point'}
								style={{left: `${100 * relativeX}%`}}
								>
								<div className={'km-label'}>{km}</div>
							</div>
						);
					})}
					<div
						className={'km-point'}
						style={{right: '0'}}
						>
						<div className={'km-label'}>{`${distance.toFixed(2)} km`}</div>
					</div>
				</div>
			</div>
		);
	}
}