import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import ScanPatron from './ScanPatron';

const ReadingRoom = (props) => {
  const { match: { path }, location } = props;

  const NoMatch = () => {
    return (
      <div data-testid="noMatch">
        <h2>Uh-oh!</h2>
        <p>
          How did you get to
          {' '}
          <tt>{location.pathname}</tt>
          ?
        </p>
      </div>
    );
  };

  return (
    <Switch>
      <Route
        path={path}
        exact
        component={ScanPatron}
      />
      <Route component={() => NoMatch()} />
    </Switch>
  );
};

ReadingRoom.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default ReadingRoom;
