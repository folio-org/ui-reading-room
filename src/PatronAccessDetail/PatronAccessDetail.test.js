
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import PatronAccessDetail from './PatronAccessDetail';

const allowedAccessProps = {
  access: 'ALLOWED',
  notes: 'Notes for allowed',
  readingRoomName: 'reading room allowed',
};
const notAllowedAccessProps = {
  access: 'NOT_ALLOWED',
  notes: 'Notes for allowed',
  readingRoomName: 'reading room not allowed',
};

describe('PatronAccessDetail', () => {
  describe('when patron has access to reading room', () => {
    it('should display "Allow access"', () => {
      render(<PatronAccessDetail rraPermission={allowedAccessProps} />);
      expect(screen.getByTestId('roomName-access-notes')).toHaveTextContent('ui-reading-room.allowAccess');
    });

    it('should display reading room name', () => {
      render(<PatronAccessDetail rraPermission={allowedAccessProps} />);
      expect(screen.getByTestId('roomName-access-notes')).toHaveTextContent(allowedAccessProps.readingRoomName);
    });

    it('should display notes for user', () => {
      render(<PatronAccessDetail rraPermission={allowedAccessProps} />);
      expect(screen.getByTestId('roomName-access-notes')).toHaveTextContent('ui-reading-room.note');
    });
  });

  describe('when patron do not have access to reading room', () => {
    it('should display "Deny access"', () => {
      render(<PatronAccessDetail rraPermission={notAllowedAccessProps} />);
      expect(screen.getByTestId('roomName-access-notes')).toHaveTextContent('ui-reading-room.denyAccess');
    });

    it('should display reading room name', () => {
      render(<PatronAccessDetail rraPermission={notAllowedAccessProps} />);
      expect(screen.getByTestId('roomName-access-notes')).toHaveTextContent(notAllowedAccessProps.readingRoomName);
    });

    it('should display notes for user', () => {
      render(<PatronAccessDetail rraPermission={allowedAccessProps} />);
      expect(screen.getByTestId('roomName-access-notes')).toHaveTextContent('ui-reading-room.note');
    });
  });
});
