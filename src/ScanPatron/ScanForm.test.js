import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { userEvent } from '@folio/jest-config-stripes/testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';
import renderWithRouter from '../../test/jest/helpers/renderWithRouter';

import ScanForm from './ScanForm';
import { useReadingRoom } from '../hooks';

jest.unmock('@folio/stripes/components');

jest.mock('../components/PatronDetail', () => jest.fn(() => <div>PatronDetail</div>));
jest.mock('../components/PatronAccessDetail', () => jest.fn(() => <div>PatronAccessDetail</div>));
jest.mock('../components/Footer', () => jest.fn(() => <div>Footer</div>));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useReadingRoom: jest.fn(),
  useProfilePicConfigForTenant: jest.fn().mockReturnValue(true),
}));

const mockedReadingRoom = {
  data: {
    readingRooms: [
      {
        name: 'reading room service'
      }
    ]
  },
  refetch: jest.fn(),
  isLoading: false,
};
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
    scannedPatronDetails: {
      active: true
    },
    patronRRAPermission: {},
    resetDetails,
    currUserId:'currUserId',
    currSPId: 'currSPId',
    mutator: {},
    loading: false,
  };

  describe('when scannedPatronDetails and patronRRAPermission props are set', () => {
    beforeEach(() => {
      useReadingRoom
        .mockClear()
        .mockReturnValue(mockedReadingRoom);
      renderComponent(props);
    });

    it('should render with no axe errors', async () => {
      await runAxeTest({
        rootNode: document.body,
      });
    });

    it('should render component', () => {
      expect(screen.getByText('reading room service . ui-reading-room.scanPatronCard')).toBeDefined();
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
      useReadingRoom
        .mockClear()
        .mockReturnValue(mockedReadingRoom);
      renderComponent(alteredProps);
    });

    ['PatronDetail', 'PatronAccessDetail', 'Footer'].forEach(text => {
      it(`should display ${text}`, () => {
        expect(screen.queryByText(`${text}`)).not.toBeInTheDocument();
      });
    });
  });

  describe('when no reading rooms are available at the current service point', () => {
    beforeEach(() => {
      useReadingRoom
        .mockClear()
        .mockReturnValue({
          data: {
            readingRooms: []
          },
          refetch: jest.fn(),
          isLoading: false,
        });
      renderComponent(props);
    });

    it('should display text to indicate no reading rooms defined at the current service point', () => {
      expect(screen.getByText('ui-reading-room.scanPatronCard')).toBeDefined();
    });

    it('should disable input field', () => {
      expect(screen.getByRole('textbox')).toHaveAttribute('disabled');
    });

    it('should disable enter button', () => {
      expect(screen.getByRole('button', { name: 'ui-reading-room.enter' })).toHaveAttribute('disabled');
    });
  });
});
