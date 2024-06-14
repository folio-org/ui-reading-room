import { waitFor, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';

import ScanPatron from './ScanPatron';

jest.unmock('@folio/stripes/components');

const mockedUser = {
  name: 'name'
};
const props = {
  mutator: {
    patrons: {
      GET: jest.fn().mockResolvedValue([mockedUser]),
    },
    userProfilePicConfig: {},
    patronReadingRoomAccess: {
      GET: jest.fn().mockResolvedValue(['user']),
    },
  },
  resources: {},
  stripes: {
    connect: jest.fn((component) => component),
    user: {
      user: {
        curServicePoint: {
          id: '1'
        }
      }
    }
  },
};

const renderComponent = () => {
  renderWithRouter(<ScanPatron {...props} />);
};

describe('ScanPatron', () => {
  it('should render ScanForm ', async () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'ui-reading-room.enter' })).toBeDefined();
  });

  it('should display patron details when patron is scanned', async () => {
    renderComponent();
    const barcodeField = document.querySelector('[id="patronBarcode"]');
    await userEvent.type(barcodeField, '123');
    await userEvent.click(screen.getByRole('button', { name: 'ui-reading-room.enter' }));

    await waitFor(() => expect(screen.getByText('ui-reading-room.borrower')).toBeInTheDocument());
  });

  it('should clear borrower details when cancel button is clicked', async () => {
    renderComponent();
    const barcodeField = document.querySelector('[id="patronBarcode"]');
    await userEvent.type(barcodeField, '123');
    await userEvent.click(screen.getByRole('button', { name: 'ui-reading-room.enter' }));

    await waitFor(() => expect(screen.getByText('ui-reading-room.borrower')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('ui-reading-room.cancel')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: 'ui-reading-room.cancel' }));

    await waitFor(() => expect(screen.queryByText('ui-reading-room.borrower')).not.toBeInTheDocument());
  });
});
