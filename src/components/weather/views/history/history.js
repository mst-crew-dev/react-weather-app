import React, { Component } from 'react';
import Scale from '../scale/scale';
import './history.scss';

class History extends Component {
  render() {
    const { morning, day, evening, night } = this.props.history;
    const { scale } = this.props;

    // TODO: Rework grid item to reusable component (something like HistoryDayTime)
    return (
      <div className="grid-history">
        <div>Morning</div>
        <div className="temp">
          <span>{morning[scale]} <Scale scale={scale} /></span>
        </div>

        <div>Day</div>
        <div className="temp">
          <span>{day[scale]} <Scale scale={scale} /></span>
        </div>

        <div>Evening</div>
        <div className="temp">
          <span>{evening[scale]} <Scale scale={scale} /></span>
        </div>

        <div>Night</div>
        <div className="temp">
          <span>{night[scale]} <Scale scale={scale} /></span>
        </div>
      </div>
    );
  }
}

export default History;
