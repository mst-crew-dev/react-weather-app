import React, { Component } from 'react';
import './header.scss';

class Header extends Component {

  onScaleChange = (event) => {
    this.props.scaleChangeClick(event.target.value);
  };

  render() {
    const { title, scale,  goBackButtonClick } = this.props;

    return (
      <div className="grid-header">
        <div className="back">
          <button onClick={goBackButtonClick} className="btn-icon">
            <i className="icon material-icons">arrow_back</i>
          </button>
        </div>
        <div className="title">
          <span className="heading">{title}</span>
        </div>
        <div className="toggle">
          <div className="switch" onChange={this.onScaleChange}>
            <input type="radio" className="switch-input" name="view" value="temp_c" id="week" defaultChecked={scale ==="temp_c"} />
            <label htmlFor="week" className="switch-label switch-label-left">&deg;C</label>
            <input type="radio" className="switch-input" name="view" value="temp_f" id="month" defaultChecked={scale ==="temp_f"}/>
            <label htmlFor="month" className="switch-label switch-label-right">&deg;F</label>
            <span className="switch-selection"></span>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
