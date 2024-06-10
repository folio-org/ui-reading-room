import { render, waitFor, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import ScanPatron from './ScanPatron';

jest.mock('./ScanForm', () => jest.fn(({ handleScanPatron }) => <button type="button" onClick={() => handleScanPatron('123')}>enter</button>));
jest.mock('../PatronDetail', () => jest.fn(() => <div>PatronDetail</div>));
jest.mock('../PatronAccessDetail', () => jest.fn(() => <div>PatronAccessDetail</div>));

const props = {
  mutator: {
    patrons: {
      GET: jest.fn().mockResolvedValue([{}]),
    },
    userProfilePicConfig: {},
    patronReadingRoomAccess: {
      GET: jest.fn().mockResolvedValue(['user']),
    },
  },
  resources: {},
};

const renderComponent = () => {
  render(<ScanPatron {...props} />);
};

describe('ScanPatron', () => {
  it('should render component', () => {
    renderComponent();
    expect(screen.getByText('ui-reading-room.scanPatronCard')).toBeDefined();
  });

  it('should not display Allow button', () => {
    renderComponent();
    expect(screen.queryByRole('button', { name: 'ui-reading-room.allow' })).not.toBeInTheDocument();
  });

  it('should not display Deny button', () => {
    renderComponent();
    expect(screen.queryByRole('button', { name: 'ui-reading-room.deny' })).not.toBeInTheDocument();
  });

  it('should not display Cancel button', () => {
    renderComponent();
    expect(screen.queryByRole('button', { name: 'ui-reading-room.cancel' })).not.toBeInTheDocument();
  });

  it('should render ScanForm ', async () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'enter' }));
  });

  describe('when patron is scanned', () => {
    beforeEach(async () => {
      renderComponent();
      await userEvent.click(screen.getByText('enter'));
    });
    it('should display Allow button', async () => {
      await waitFor(() => expect(screen.getByRole('button', { name: 'ui-reading-room.allow' })).toBeInTheDocument());
    });

    it('should display Deny button', async () => {
      await waitFor(() => expect(screen.getByRole('button', { name: 'ui-reading-room.deny' })).toBeInTheDocument());
    });

    it('should display Cancel button', async () => {
      await waitFor(() => expect(screen.getByRole('button', { name: 'ui-reading-room.cancel' })).toBeInTheDocument());
    });

    it('should render PatronDetail ', async () => {
      await waitFor(() => expect(screen.getByText('PatronDetail')).toBeDefined());
    });

    it('should render PatronAccessDetail ', async () => {
      await waitFor(() => expect(screen.getByText('PatronAccessDetail')).toBeDefined());
    });

    describe('when cancel button is clicked', () => {
      beforeEach(async () => {
        await userEvent.click(screen.getByText('ui-reading-room.cancel'));
      });

      it('should not display Allow button', async () => {
        renderComponent();
        await waitFor(() => expect(screen.queryByRole('button', { name: 'ui-reading-room.allow' })).not.toBeInTheDocument());
      });

      it('should not display Deny button', async () => {
        renderComponent();
        await waitFor(() => expect(screen.queryByRole('button', { name: 'ui-reading-room.deny' })).not.toBeInTheDocument());
      });

      it('should not display Cancel button', async () => {
        renderComponent();
        await waitFor(() => expect(screen.queryByRole('button', { name: 'ui-reading-room.cancel' })).not.toBeInTheDocument());
      });

      it('should not display PatronDetail', async () => {
        renderComponent();
        await waitFor(() => expect(screen.queryByText('PatronDetail')).not.toBeInTheDocument());
      });

      it('should not display PatronAccessDetail', async () => {
        renderComponent();
        await waitFor(() => expect(screen.queryByText('PatronAccessDetail')).not.toBeInTheDocument());
      });
    });
  });
});
