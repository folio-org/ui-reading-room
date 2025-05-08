import { within } from '@folio/jest-config-stripes/testing-library/react';

import PatronBlock from './PatronBlock';
import renderWithRouter from '../../../test/jest/helpers/renderWithRouter';
import {
  useAutomatedPatronBlocks,
  useManualPatronBlocks,
} from '../../hooks';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useManualPatronBlocks: jest.fn(),
  useAutomatedPatronBlocks: jest.fn(),
}));

const manualPatronBlocks = [
  {
    type: 'Manual',
    desc: 'desc1',
    staffInformation: 'info1',
    patronMessage: 'message1',
    borrowing: true,
    renewals: true,
    requests: true,
    userId: '00ceaef0-a650-437f-8bfb-60b5b01568b1',
    metadata: {
      createdDate: '2025-05-06T07:47:23.270+00:00',
    },
    id: '33b3b0cf-2eb8-4bdd-81ef-50afe7bd1875'
  },
  {
    type: 'Manual',
    desc: 'desc2',
    staffInformation: 'info2',
    patronMessage: 'message2',
    expirationDate: '3025-05-07T00:00:00.000+00:00',
    borrowing: true,
    renewals: false,
    requests: true,
    userId: '00ceaef0-a650-437f-8bfb-60b5b01568b1',
    metadata: {
      createdDate: '2025-05-06T07:48:20.179+00:00',
    },
    id: '2a96e4b8-9691-411b-beca-e990c1487999'
  },
  {
    type: 'Manual',
    desc: 'desc6',
    staffInformation: 'info6',
    patronMessage: 'message6',
    expirationDate: '2025-05-01T00:00:00.000+00:00',
    borrowing: true,
    renewals: true,
    requests: false,
    userId: '12c71ee8-4856-4f78-9bf4-aa25cdd94de8',
    metadata: {
      createdDate: '2025-05-05T12:34:41.116+00:00',
    },
    id: 'd418ae2b-52ed-440d-b805-04b25d8a8405'
  },
];

const automatedPatronBlocks = [
  {
    blockBorrowing: true,
    blockRenewals: false,
    blockRequests: false,
    message: 'Maximum number of items charged out1'
  }
];

const renderPatronBlock = (props) => renderWithRouter(
  <PatronBlock
    userId="user-id"
    {...props}
  />
);

describe('PatronBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useManualPatronBlocks.mockReturnValue({
      manualPatronBlocks,
      isLoadingManualPatronBlocks: false,
    });

    useAutomatedPatronBlocks.mockReturnValue({
      automatedPatronBlocks,
      isLoadingAutomatedPatronBlocks: false,
    });
  });

  it('should call useManualPatronBlocks and useAutomatedPatronBlocks with userId', () => {
    const userId = 'user-id';

    renderPatronBlock({ userId });

    expect(useManualPatronBlocks).toHaveBeenCalledWith({ userId });
    expect(useAutomatedPatronBlocks).toHaveBeenCalledWith({ userId });
  });

  it('should display columns', () => {
    const { getByText } = renderPatronBlock();

    expect(getByText('ui-reading-room.patronBlocks.label')).toBeInTheDocument();
    expect(getByText('ui-reading-room.patronBlocks.columns.type')).toBeInTheDocument();
    expect(getByText('ui-reading-room.patronBlocks.columns.desc')).toBeInTheDocument();
    expect(getByText('ui-reading-room.patronBlocks.columns.blocked')).toBeInTheDocument();
  });

  it('should display manual blocks', () => {
    const { getByText, getAllByText } = renderPatronBlock();

    expect(getAllByText('Manual')).toHaveLength(2);
    expect(getByText('desc1')).toBeInTheDocument();
    expect(getByText('desc2')).toBeInTheDocument();
    expect(getByText('ui-reading-room.patronBlocks.columns.borrowing, ui-reading-room.patronBlocks.columns.requests')).toBeInTheDocument();
    expect(getByText('ui-reading-room.patronBlocks.columns.borrowing, ui-reading-room.patronBlocks.columns.renewals, ui-reading-room.patronBlocks.columns.requests')).toBeInTheDocument();
  });

  it('should display automated block', () => {
    const { getByText } = renderPatronBlock();

    expect(getByText('Maximum number of items charged out1')).toBeInTheDocument();
    expect(getByText('ui-reading-room.patronBlocks.columns.borrowing')).toBeInTheDocument();
  });

  it('should display most recent blocks first', () => {
    const { getAllByRole } = renderPatronBlock();

    const rows = getAllByRole('row');
    const firstRow = within(rows[1]).getByText('Maximum number of items charged out1');
    const secondRow = within(rows[2]).getByText('desc2');
    const thirdRow = within(rows[3]).getByText('desc1');

    expect(firstRow).toBeInTheDocument();
    expect(secondRow).toBeInTheDocument();
    expect(thirdRow).toBeInTheDocument();
  });

  it('should display only patron blocks where the expiration date is either today or in the future', () => {
    const { getByText, queryByText } = renderPatronBlock();

    expect(getByText('desc1')).toBeInTheDocument();
    expect(getByText('desc2')).toBeInTheDocument();
    expect(queryByText('desc6')).not.toBeInTheDocument();
  });
});
