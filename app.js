import { render } from 'react-dom';
import React from 'react';
import {
  Compass,
  Composer,
  Geolocation,
  CompassHeading,
  Destination } from './lib';

import data from './data.json';

class Application extends React.Component {
  state = {
    locations: data
  }

  _skipLocation = locations =>
    [...locations.slice(1), locations[0]];

  componentDidMount() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }

  render() {
    return (
      <main>
        <h1>Cheap Eats Compass</h1>
        <div>
          <Composer components={[
            <Geolocation />,
            ({ render }) => (
              <CompassHeading>
                {(heading, errors) => render([heading, errors])}
              </CompassHeading>
            )
          ]}>
            {([position, [ heading, errors ]]) => (
              <Destination locations={this.state.locations} position={position}>
                {(destination, distance, bearing, adjustLocations) => {
                  const { latitude, longitude } = position;
                  const dirUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination.location.formatted_address}`;

                  return (errors.length) ? (
                    <div>
                      <h3>Errors were detected</h3>
                      <ul>
                        {errors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                    </div>
                  ) : (
                    <div className={Math.floor(bearing) === Math.floor(heading) ? 'bearing-matches' : null}>
                      <p>The closest Cheap Eat is {destination.name} at <a href={dirUrl}>{destination.location.formatted_address}</a>.</p>
                      <p>It is {distance} miles away.</p>
                      <Compass
                        bearing={bearing}
                        heading={heading} />
                      <button onClick={e => adjustLocations(this._skipLocation)}>
                        Skip to Next Location
                      </button>
                    </div>
                  )
                }}
              </Destination>
            )}
          </Composer>
        </div>
        <div className="credits">
          <h3>Credits</h3>
          <p>this app made by <a href="https://crimes.cool">aaron petcoff</a>. source data from "<a href="http://www.grubstreet.com/2018/07/best-cheap-eats-nyc-2018.html">The Underground Gourmet’s Best New Cheap Eats in New York</a>" at Grubstreet.</p>
        </div>
      </main>
    )
  }
}

render(
  <Application />,
  document.querySelector('#app')
);
