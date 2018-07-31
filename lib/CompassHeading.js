import React from 'react';

const DEGREE_TO_RADIAN = Math.PI / 180;

class CompassHeading extends React.Component {
  state = {
    heading: 0,
    errors: []
  }

  _handleOrientation = evt => {
    const { absolute, alpha, beta, gamma } = evt;

    if (evt.webkitCompassHeading) {
      this.setState({ heading: evt.webkitCompassHeading, errors: [] });
    } else if (absolute && alpha && beta && gamma) {
      this.setState({ heading: calculateCompassHeadingFromOrientation(alpha, beta, gamma), errors: [] });
    } else {
      this.setState(({ errors }) => ({ errors: [
        ...errors,
        'This device does not support compass heading detection'
      ].filter((x, i, a) => a.indexOf(x) === i)}));
    }
  }

  componentDidMount() {
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', this._handleOrientation);
    } else {
      window.addEventListener('deviceorientation', this._handleOrientation);
    }
  }

  componentWillUnmount() {
    if ('ondeviceorientationabsolute' in window) {
      window.removeEventListener('deviceorientationabsolute', this._handleOrientation);
    } else {
      window.removeEventListener('deviceorientation', this._handleOrientation);
    }
  }

  render() {
    return this.props.children(this.state.heading, this.state.errors);
  }
}

export default CompassHeading;

// from https://w3c.github.io/deviceorientation/spec-source-orientation.html#worked-example
function calculateCompassHeadingFromOrientation(alpha, beta, gamma) {
  const _x = beta  ? beta  * DEGREE_TO_RADIAN : 0; // beta value
  const _y = gamma ? gamma * DEGREE_TO_RADIAN : 0; // gamma value
  const _z = alpha ? alpha * DEGREE_TO_RADIAN : 0; // alpha value

  // const cX = Math.cos(_x);
  const cY = Math.cos(_y);
  const cZ = Math.cos(_z);
  const sX = Math.sin(_x);
  const sY = Math.sin(_y);
  const sZ = Math.sin(_z);

  // Calculate Vx and Vy components
  const Vx = -cZ * sY - sZ * sX * cY;
  const Vy = -sZ * sY + cZ * sX * cY;

  // Calculate compass heading
  let compassHeading = Math.atan(Vx / Vy);

  // Convert compass heading to use whole unit circle
  if(Vy < 0) {
    compassHeading += Math.PI;
  } else if(Vx < 0) {
    compassHeading += 2 * Math.PI;
  }

  return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
}
