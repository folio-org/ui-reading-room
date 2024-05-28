
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import ReadingRoom from './index';

const readingRoomRoute = '/reading-room';

describe('when path is "/reading-room"', () => {
  const props = {
    actAs: 'app',
    match: { params: { }, path: readingRoomRoute, url: readingRoomRoute, isExact: true },
    location: { pathname: readingRoomRoute },
    history: {
      location: { pathname: readingRoomRoute },
    },
  };

  it('should render component', () => {
    render(
      <MemoryRouter initialEntries={[readingRoomRoute]}>
        <ReadingRoom {...props} />
      </MemoryRouter>
    );
    expect(screen.getByText('ScanPatron')).toBeDefined();
  });
});

describe('When route is not matched', () => {
  const badRoute = '/no-match';
  const props = {
    actAs: 'app',
    match: { params: { }, path: badRoute, url: badRoute, isExact: true },
    location: { pathname: badRoute },
    history: {
      location: { pathname: badRoute },
    },
  };

  it('should render "No match" component', () => {
    render(
      <MemoryRouter initialEntries={[readingRoomRoute]}>
        <ReadingRoom {...props} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('noMatch')).toBeInTheDocument();
  });
});
