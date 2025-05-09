import { act } from 'react';

import smartComponents, { NotesSmartAccordion } from '@folio/stripes/smart-components';
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

jest.spyOn(smartComponents, 'NotesSmartAccordion').mockImplementation(props => (
  <NotesSmartAccordion
    {...props}
    open
    resources={{
      assignedNotes: {
        records: [{
          notes: [
            {
              id: '3b6add11-4a28-4351-9395-1b67bc35695d',
              type: 'General note',
              title: 'Note1',
              content: '<p>Description1</p>',
              metadata: {
                createdDate: '2025-05-09T11:01:54.330526Z',
              },
            },
          ],
          totalRecords: 1,
        }],
      },
    }}
  />
));

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

const renderComponent = (props = {}) => {
  return renderWithRouter(
    <ScanForm
      handleSubmit={handleSubmit}
      form={mockedForm}
      onSubmit={onSubmit}
      scannedPatronDetails={{
        id: 'user-id',
        active: true
      }}
      resetDetails={resetDetails}
      currUserId="currUserId"
      currSPId="currSPId"
      mutator={{}}
      loading={false}
      patronRRAPermission={{}}
      {...props}
    />
  );
};

describe('ScanForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useReadingRoom.mockReturnValue(mockedReadingRoom);
  });

  describe('when scannedPatronDetails and patronRRAPermission props are set', () => {
    beforeEach(() => {
      renderComponent();
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

      await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    });

    ['PatronDetail', 'PatronAccessDetail', 'Footer'].forEach(text => {
      it(`should display ${text}`, () => {
        expect(screen.getByText(`${text}`)).toBeInTheDocument();
      });
    });
  });

  describe('when scannedPatronDetails and patronRRAPermission props are not set', () => {
    const alteredProps = {
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
      renderComponent();
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

  describe('when scannedPatronetails is null', () => {
    beforeEach(() => {
      const alteredProps = {
        scannedPatronDetails: null,
      };
      renderComponent(alteredProps);
    });
    it('should display error message for non-existent barcode', () => {
      expect(screen.getAllByText("ui-reading-room.userDoesn'tExist")).toBeDefined();
    });
  });

  describe('NotesSmartAccordion', () => {
    it('should display a label', () => {
      renderComponent();
      expect(screen.getByText('ui-reading-room.notes.label')).toBeDefined();
    });

    it('should not display Edit button', () => {
      renderComponent();
      expect(screen.queryByText('stripes-components.button.edit')).not.toBeInTheDocument();
    });

    it('should not display New button', () => {
      renderComponent();
      expect(screen.queryByText('stripes-smart-components.new')).not.toBeInTheDocument();
    });

    it('should not display Assign/Unassign button', async () => {
      renderComponent();
      expect(screen.queryByText('stripes-smart-components.assignUnassign')).not.toBeInTheDocument();
    });

    it('should not redirect on a row click', async () => {
      const { getByText, history } = renderComponent();

      await act(() => userEvent.click(getByText('Description1')));

      expect(history.location.pathname).toBe('/');
    });
  });
});
