import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import PatronAccessDetail from './PatronAccessDetail';

const notAllowedAccessProps = {
  access: 'NOT_ALLOWED',
  notes: 'Notes for allowed',
  readingRoomName: 'reading room not allowed',
};

const renderComponent = (props = {}) => render(
  <PatronAccessDetail
    active
    rraPermission={{
      readingRoomName: 'reading room allowed',
      access: 'ALLOWED',
      notes: 'Notes for allowed',
    }}
    {...props}
  />
);

describe('PatronAccessDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when patron has access to reading room', () => {
    describe('when the user is active', () => {
      beforeEach(() => {
        renderComponent();
      });

      it('should display "Allow access"', () => {
        expect(screen.getByText('reading room allowed: ui-reading-room.allowAccess')).toBeVisible();
      });

      it('should display a note', () => {
        expect(screen.getByText('ui-reading-room.note')).toBeVisible();
      });

      it('should display the success message banner', () => {
        expect(document.querySelector('[data-test-message-banner]')).toHaveClass('type-success');
      });
    });

    describe('when the user is inactive', () => {
      beforeEach(() => {
        renderComponent({
          active: false,
        });
      });

      it('should display "Inactive user"', () => {
        expect(screen.getByText('ui-reading-room.inactiveUser')).toBeVisible();
      });

      it('should display a note', () => {
        expect(screen.getByText('ui-reading-room.note')).toBeVisible();
      });

      it('should display the warning message banner', () => {
        expect(document.querySelector('[data-test-message-banner]')).toHaveClass('type-warning');
      });
    });
  });

  describe('when patron do not have access to reading room', () => {
    describe('when the user is active', () => {
      beforeEach(() => {
        renderComponent({
          rraPermission: notAllowedAccessProps,
        });
      });

      it('should display "Not allowed"', () => {
        expect(screen.getByText('reading room not allowed: ui-reading-room.denyAccess')).toBeVisible();
      });

      it('should display a note', () => {
        expect(screen.getByText('ui-reading-room.note')).toBeVisible();
      });

      it('should display the warning message banner', () => {
        expect(document.querySelector('[data-test-message-banner]')).toHaveClass('type-warning');
      });
    });

    describe('when the user is inactive', () => {
      beforeEach(() => {
        renderComponent({
          active: false,
          rraPermission: notAllowedAccessProps,
        });
      });

      it('should display "Inactive user"', () => {
        expect(screen.getByText('ui-reading-room.inactiveUser')).toBeVisible();
      });

      it('should display a note', () => {
        expect(screen.getByText('ui-reading-room.note')).toBeVisible();
      });

      it('should display the warning message banner', () => {
        expect(document.querySelector('[data-test-message-banner]')).toHaveClass('type-warning');
      });
    });
  });
});
