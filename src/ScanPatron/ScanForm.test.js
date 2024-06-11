import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { userEvent } from '@folio/jest-config-stripes/testing-library/user-event';

import ScanForm from './ScanForm';

jest.mock('../PatronDetail', () => jest.fn(() => <div>PatronDetail</div>));
jest.mock('../PatronAccessDetail', () => jest.fn(() => <div>PatronAccessDetail</div>));
jest.mock('../Footer', () => jest.fn(() => <div>Footer</div>));

const handleSubmit = jest.fn();
const handleScanPatron = jest.fn();
const mockedForm = {
  change: jest.fn(),
  getState: jest.fn(),
};
const resetDetails = jest.fn();

const renderComponent = (props) => {
  render(<ScanForm {...props} />);
};

describe('ScanForm', () => {
  const props = {
    handleSubmit,
    handleScanPatron,
    form: mockedForm,
    scannedPatronDetails: {},
    patronRRAPermission: {},
    resources: {
      userProfilePicConfig: {
        records: [
          { enabled: true },
        ],
      }
    },
    resetDetails,
  };

  describe('when scannedPatronDetails and patronRRAPermission props are set', () => {
    beforeEach(() => {
      renderComponent(props);
    });

    it('should render component', () => {
      expect(screen.getByText('ui-reading-room.scanPatronCard')).toBeDefined();
    });

    it('should render patron barcode field', () => {
      expect(screen.getByText('patronBarcode')).toBeDefined();
    });

    it('should render enter button', () => {
      expect(screen.getByText('ui-reading-room.enter')).toBeDefined();
    });

    it('should call handleSubmit', async () => {
      const barcodeField = document.querySelector('[id="patronBarcode"]');
      const enterButton = screen.getByRole('button', { name: 'ui-reading-room.enter' });

      await userEvent.type(barcodeField, '123');
      await userEvent.click(enterButton);

      await waitFor(() => expect(props.handleSubmit).toHaveBeenCalled());
    });

    ['PatronDetail', 'PatronAccessDetail', 'Footer'].forEach(text => {
      it(`should display ${text}`, () => {
        expect(screen.queryByText(`${text}`)).toBeInTheDocument();
      });
    });
  });

  describe('when scannedPatronDetails and patronRRAPermission props are not set', () => {
    const alteredProps = {
      ...props,
      scannedPatronDetails: undefined,
      patronRRAPermission: undefined,
    };

    beforeEach(() => {
      renderComponent(alteredProps);
    });

    ['PatronDetail', 'PatronAccessDetail', 'Footer'].forEach(text => {
      it(`should display ${text}`, () => {
        expect(screen.queryByText(`${text}`)).not.toBeInTheDocument();
      });
    });
  });
});
