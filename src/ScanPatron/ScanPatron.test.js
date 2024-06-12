import { render, waitFor, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import ScanPatron from './ScanPatron';

jest.mock('./ScanForm', () => jest.fn(({ handleScanPatron }) => <button type="button" onClick={() => handleScanPatron('123')}>enter</button>));
jest.mock('../PatronDetail', () => jest.fn(() => <div>PatronDetail</div>));

const props = {
  mutator: {
    patrons: {
      GET: jest.fn().mockResolvedValue(['user']),
    },
    userProfilePicConfig: {}
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

  it('should render ScanForm ', async () => {
    renderComponent();

    await userEvent.click(screen.getByText('enter'));

    await waitFor(() => expect(screen.getByText('PatronDetail')).toBeDefined());
  });

  it('should display Allow button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'ui-reading-room.allow' })).toBeDefined();
  });

  it('should display Deny button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'ui-reading-room.deny' })).toBeDefined();
  });

  it('should display Cancel button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'ui-reading-room.cancel' })).toBeDefined();
  });
});
