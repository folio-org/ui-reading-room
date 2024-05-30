import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import ScanPatron from './ScanPatron';
import css from './index.css';

const NoMatch = (path) => {
  return (
    <div data-testid="noMatch">
      <h2>Uh-oh!</h2>
      <p>
        How did you get to <span className={css.noMatch}>{path}</span>?
      </p>
    </div>
  );
};

const ReadingRoom = (props) => {
  const { match: { path }, location } = props;

  return (
    <Switch>
      <Route
        path={path}
        exact
        component={ScanPatron}
      />
      <Route component={() => NoMatch(location.pathname)} />
    </Switch>
  );
};

ReadingRoom.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default ReadingRoom;
