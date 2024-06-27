import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import useReadingRoom from './useReadingRoom';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: jest.fn(() => ['test']),
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useREadingRoom', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({ enabled: true }),
  }));
  const kyMock = {
    get: mockGet,
  };

  beforeEach(() => {
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should fetch reading room for provided service point id', async () => {
    const { result } = renderHook(() => useReadingRoom('servicePointId'), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(mockGet.mock.calls.length).toBe(1);
  });
});
