import React from 'react';

class Geolocation extends React.Component {
  state = {
    latitude: null,
    longitude: null
  }

  _handlePosition = position => {
    const { latitude, longitude } = position.coords;

    this.setState({ latitude, longitude });
  }

  componentDidMount() {
    navigator.geolocation.watchPosition(this._handlePosition);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch();
  }

  render() {
    return (this.state.latitude && this.state.longitude)
      ? this.props.children(this.state)
      : null;
  }
}

export default Geolocation;
