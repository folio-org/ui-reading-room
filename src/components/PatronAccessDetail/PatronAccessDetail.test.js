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

const testId = 'room-name-access-notes';

describe('PatronAccessDetail', () => {
  describe('when patron has access to reading room', () => {
    beforeEach(() => {
      const props = {
        rraPermission: allowedAccessProps,
        active: true,
      };

      render(<PatronAccessDetail {...props} />);
    });

    it('should display "Allow access"', () => {
      expect(screen.getByTestId(testId)).toHaveTextContent('ui-reading-room.allowAccess');
    });

    it('should display reading room name', () => {
      expect(screen.getByTestId(testId)).toHaveTextContent(allowedAccessProps.readingRoomName);
    });

    it('should display notes for user', () => {
      expect(screen.getByTestId(testId)).toHaveTextContent('ui-reading-room.note');
    });
  });

  describe('when patron do not have access to reading room', () => {
    beforeEach(() => {
      const props = {
        rraPermission: notAllowedAccessProps,
        active: true,
      };

      render(<PatronAccessDetail {...props} />);
    });

    it('should display "Deny access"', () => {
      expect(screen.getByTestId(testId)).toHaveTextContent('ui-reading-room.denyAccess');
    });

    it('should display reading room name', () => {
      expect(screen.getByTestId(testId)).toHaveTextContent(notAllowedAccessProps.readingRoomName);
    });

    it('should display notes for user', () => {
      expect(screen.getByTestId(testId)).toHaveTextContent('ui-reading-room.note');
    });
  });
});
