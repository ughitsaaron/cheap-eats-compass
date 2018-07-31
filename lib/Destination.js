import {
  getDistance,
  getRhumbLineBearing as getBearing } from 'geolib';
import React from 'react';

const METERS_IN_MILES = 1609.34;

class Destination extends React.Component {
  state = {
    distance: null,
    bearing: null,
    orderedLocations: null
  }

  _resortAndUpdateState = sortfn => {
    this.setState(({ orderedLocations }) => {
      const sorted = sortfn(orderedLocations);
      const { distance, bearing } = calculateTargetDistanceAndBearing(this.props.position, orderedLocations);

      return { orderedLocations: sorted, bearing, distance };
    });
  }

  componentDidMount() {
    const sortByDistance = (a, b) => a.distance - b.distance;
    const { latitude, longitude } = this.props.position;
    const orderedLocations = this.props.locations.map(
      x => ({ ...x, distance: getDistance({ latitude, longitude }, { ...x.coordinates }) })
    ).sort(sortByDistance)
    const { distance, bearing } = calculateTargetDistanceAndBearing(this.props.position, orderedLocations);

    this.setState({ distance, bearing, orderedLocations });
  }

  render() {
    return this.state.orderedLocations
      ? this.props.children(
          this.state.orderedLocations[0],
          this.state.distance,
          this.state.bearing,
          this._resortAndUpdateState
        )
      : null;
  }
}

export default Destination;

function calculateTargetDistanceAndBearing({ latitude, longitude }, orderedLocations) {
    const target = orderedLocations[0].coordinates;
    const distance = (orderedLocations[0].distance / METERS_IN_MILES).toFixed(2);
    const bearing = getBearing({ latitude, longitude }, target);

    return { distance, bearing, orderedLocations };
  }
