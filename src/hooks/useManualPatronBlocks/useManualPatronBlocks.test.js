import { act } from 'react';

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useManualPatronBlocks from './useManualPatronBlocks';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = { manualblocks: [{ type: 'Manual' }] };

describe('useManualPatronBlocks', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(data),
  }));

  const kyMock = {
    get: mockGet,
  };

  beforeEach(() => {
    mockGet.mockClear();
    useOkapiKy.mockReturnValue(kyMock);
  });

  it('should fetch patron group by id', async () => {
    const { result } = renderHook(() => useManualPatronBlocks({ userId: 'id' }), { wrapper });

    await act(() => !result.current.isLoadingManualPatronBlocks);

    expect(mockGet).toHaveBeenCalledWith('manualblocks?query=(userId==id)&limit=10000');
    expect(result.current.manualPatronBlocks).toEqual(data.manualblocks);
  });
});
