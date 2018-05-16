import React, { Component } from 'react';

class Scale extends Component {
  render() {
    const { scale } = this.props;
    const label = scale === 'temp_c' ? 'C' : 'F';

    return <span>&deg;{label}</span>;
  }
}

export default Scale;
