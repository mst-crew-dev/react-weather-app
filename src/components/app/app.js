import React, {Component} from 'react';
import syncWeather from '../../api/api'
import Weather from '../weather/weather'
import Loader from '../loader/loader'
import Geo from '../geo/geo'

class App extends Component {
  constructor() {
    super();

    const scale = localStorage.getItem('scale');
    const weather = localStorage.getItem('weather');
    const location = localStorage.getItem('location');

    this.state = {
      loading: false,
      scale: scale ? scale : 'temp_c',
      location: location ? location : null,
      weather: weather ? JSON.parse(weather) : null
    };

    // update weather data in background
    if (weather && location) this.updateWeatherData(location);
  }

  getWeatherData = (location) => {
    this.setState({ loading: true });
    syncWeather(location)
      .then((data) => {
        this.setState({
          weather: data,
          loading: false
        });
        localStorage.setItem('weather', JSON.stringify(data));
        localStorage.setItem('location', location);
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.code === 400) alert('No matching location found.');
      });
      //  Not supported by IE and Safari
      // .finally(() => this.setState({ loading: false }));
  };

  updateWeatherData = (location) => {
    syncWeather(location)
      .then((data) => {
        this.setState({ weather: data });
        localStorage.setItem('weather', JSON.stringify(data));
      })
  };

  resetWeatherData = () => {
    this.setState({ weather: null });
    localStorage.removeItem('weather');
    localStorage.removeItem('location');
  };

  setScale = (scale) => {
    this.setState({ scale: scale });
    localStorage.setItem('scale', scale);
  };


  render() {
    if (this.state.loading) return <Loader/>;

    const { weather, scale } = this.state;

    return weather ?
      <Weather
        weather={weather}
        scale={scale}
        onGoBack={this.resetWeatherData}
        onScaleChange={this.setScale}
      />
      :
      <Geo onGeoChanged={this.getWeatherData}/>;
  }
}

export default App;
