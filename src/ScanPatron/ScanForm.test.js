import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { userEvent } from '@folio/jest-config-stripes/testing-library/user-event';

import ScanForm from './ScanForm';

describe('ScanForm', () => {
  const handleSubmit = jest.fn();
  const handleScanPatron = jest.fn();
  const mockedInitialValues = {};
  const mockedForm = {
    reset: jest.fn(),
    getState: jest.fn(() => ({ values: mockedInitialValues })),
  };
  const props = {
    handleSubmit,
    handleScanPatron,
    form: mockedForm,
  };

  it('should render ScanForm', () => {
    render(<ScanForm {...props} />);
    expect(screen.getByText('ui-reading-room.enter')).toBeDefined();
  });

  it('should call handleScanPatron', async () => {
    render(<ScanForm {...props} />);

    const barcodeField = document.querySelector('[id="patronBarcode"]');
    const enterButton = screen.getByRole('button', { name: 'ui-reading-room.enter' });
    userEvent.type(barcodeField, '123');
    userEvent.click(enterButton);

    await waitFor(() => expect(props.handleScanPatron).toHaveBeenCalled());
  });
});
