import React, { Component } from 'react';
import './geo.scss';

class Geo extends Component {
  constructor(props) {
    super(props);

    this.state = { city: '', position: null };
  }

  onCurrentPositionSubmit = () => {
    if (!navigator && !navigator.geolocation) {
      alert('Geolocation is not supported by your device');
    } else {
      navigator.geolocation.getCurrentPosition(this.onSetCurrentPositionSuccess, this.onSetCurrentPositionError);
    }
  };

  onSetCurrentPositionSuccess = (position) => {
    this.setState({
      city: '',
      position: {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }
    });

    this.handleGeoLocationFound();
  };

  onSetCurrentPositionError = () => {
    alert("Geolocation is OFF on your device.");
  };

  onCitySubmit = (event) => {
    event.preventDefault();

    if (this.state.city) this.handleGeoLocationFound();
  };

  onCityChange = (event) => {
    this.setState({
      city: event.target.value,
      position: null,
    });
  };


  handleGeoLocationFound() {
    const { city, position } = this.state;
    // set priority to search by City
    if (city) {
      this.props.onGeoChanged(city);
    } else {
      this.props.onGeoChanged(`${position.lat},${position.lon}`);
    }
  }

  render() {
    return (
      <form id="location" onSubmit={this.onCitySubmit}>
        <div className="search-container">
          <input onChange={this.onCityChange} value={this.state.city} name="city" className="city" type="text" placeholder="City"/>
          <button id="submit" type="submit" className="btn-icon">
            <i className="icon material-icons">search</i>
          </button>
        </div>
        <div className="geo-container">
          <p>or</p>
          <span>use my </span> <a className="current-position" onClick={this.onCurrentPositionSubmit}> current position</a>
        </div>
      </form>
    );
  }
}

export default Geo;
