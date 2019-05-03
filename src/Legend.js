import React from 'react';

export default class Legend extends React.Component {
	render() {
		return (
            <div className={'legend'}>
                <div className={'color'} style={{backgroundColor: '#800000'}}>
                    <div className={'percent-line'}/>
                    <div className={'percent-label'}>{'15%'}</div>
                </div>
                <div className={'color'} style={{backgroundColor: '#ff1a1a'}}>
                    <div className={'percent-line'}/>
                    <div className={'percent-label'}>{'10%'}</div>
                </div>
                <div className={'color'} style={{backgroundColor: 'orange'}}>
                    <div className={'percent-line'}/>
                    <div className={'percent-label'}>{'4%'}</div>
                </div>
                <div className={'color'} style={{backgroundColor: '#ffd9b3'}}/>
            </div>
		);
	}
}