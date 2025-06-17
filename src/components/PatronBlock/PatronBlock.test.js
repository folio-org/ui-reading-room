import PatronBlock from './PatronBlock';
import renderWithRouter from '../../../test/jest/helpers/renderWithRouter';
import { usePatronBlocks } from '../../hooks';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  usePatronBlocks: jest.fn(),
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

    usePatronBlocks.mockReturnValue({
      patronBlocks: [...manualPatronBlocks, ...automatedPatronBlocks],
      isLoading: false,
    });
  });

  it('should call usePatronBlocks with userId', () => {
    const userId = 'user-id';

    renderPatronBlock({ userId });

    expect(usePatronBlocks).toHaveBeenCalledWith({ userId });
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
});
