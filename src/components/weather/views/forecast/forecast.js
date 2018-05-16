import React, { Component } from 'react';
import Scale from '../scale/scale';
import './forecast.scss';

class Forecast extends Component {
  render() {
    const { forecast, scale } = this.props;
    const icon = 'icon wi ';

    const forecastList = forecast.map((day, i) =>
      <div key={i}>
        <p>{day.name}</p>
        <i className={icon + day.icon}></i>
        <p>{day[scale]}<Scale scale={scale}/></p>
      </div>
    );

    return (
      <div className="grid-forecast">
        {forecastList}
      </div>
    );
  }
}

export default Forecast;
