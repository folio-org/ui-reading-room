import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import ScanPatron from './ScanPatron';

jest.mock('./ScanForm', () => jest.fn(() => <div>ScanForm</div>));

const props = {
  mutator: {
    patrons: {
      GET: jest.fn(),
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

  it('should render ScanForm ', () => {
    renderComponent();
    expect(screen.getByText('ScanForm')).toBeDefined();
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
