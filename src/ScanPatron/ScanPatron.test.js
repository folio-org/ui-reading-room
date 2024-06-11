import { render, waitFor, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import ScanPatron from './ScanPatron';

jest.mock('./ScanForm', () => jest.fn(({ handleScanPatron, scannedPatronDetails }) => (
  <>
    { scannedPatronDetails && <div data-testid="patron-name">scannedPatronDetails.name</div>}
    <button type="button" onClick={() => handleScanPatron('123')}>enter</button>))
  </>
)));

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
  render(<ScanPatron {...props} />);
};

describe('ScanPatron', () => {
  it('should render ScanForm ', async () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'enter' })).toBeDefined();
  });

  it('should display patron details when patron is scanned', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: 'enter' }));

    await waitFor(() => expect(screen.getByTestId('patron-name')).toBeInTheDocument());
  });
});
