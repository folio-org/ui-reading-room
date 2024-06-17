import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { userEvent } from '@folio/jest-config-stripes/testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';

import ScanForm from './ScanForm';

jest.unmock('@folio/stripes/components');

jest.mock('../PatronDetail', () => jest.fn(() => <div>PatronDetail</div>));
jest.mock('../PatronAccessDetail', () => jest.fn(() => <div>PatronAccessDetail</div>));
jest.mock('../Footer', () => jest.fn(() => <div>Footer</div>));

const handleSubmit = jest.fn();
const mockedForm = {
  change: jest.fn(),
  getState: jest.fn(),
};
const resetDetails = jest.fn();
const onSubmit = jest.fn();

const renderComponent = (props) => {
  renderWithRouter(<ScanForm {...props} />);
};

describe('ScanForm', () => {
  const props = {
    handleSubmit,
    onSubmit,
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
    currUserId:'currUserId',
    mutator: {},
  };

  describe('when scannedPatronDetails and patronRRAPermission props are set', () => {
    beforeEach(() => {
      renderComponent(props);
    });

    it('should render with no axe errors', async () => {
      await runAxeTest({
        rootNode: document.body,
      });
    });

    it('should render component', () => {
      expect(screen.getByText('ui-reading-room.scanPatronCard')).toBeDefined();
    });

    it('should render patron barcode field', () => {
      expect(document.querySelector('[id="patronBarcode"]')).toBeDefined();
    });

    it('should render enter button', () => {
      expect(screen.getByText('ui-reading-room.enter')).toBeDefined();
    });

    it('should call handleSubmit', async () => {
      const barcodeField = document.querySelector('[id="patronBarcode"]');
      const enterButton = screen.getByRole('button', { name: 'ui-reading-room.enter' });

      await userEvent.type(barcodeField, '123');
      await userEvent.click(enterButton);

      await waitFor(() => expect(props.onSubmit).toHaveBeenCalled());
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
