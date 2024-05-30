import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import ScanPatron from './ScanPatron';

describe('ScanPatron', () => {
  it('should render component', () => {
    render(<ScanPatron />);
    expect(screen.getByText('ScanPatron')).toBeDefined();
  });
});
