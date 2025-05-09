import { act } from 'react';

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useAutomatedPatronBlocks from './useAutomatedPatronBlocks';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = { automatedPatronBlocks: [{ message: 'some message' }] };

describe('useAutomatedPatronBlocks', () => {
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
    const { result } = renderHook(() => useAutomatedPatronBlocks({ userId: 'id' }), { wrapper });

    await act(() => !result.current.isLoadingAutomatedPatronBlocks);

    expect(mockGet).toHaveBeenCalledWith('automated-patron-blocks/id?limit=2000');
    expect(result.current.automatedPatronBlocks).toEqual(data.automatedPatronBlocks);
  });
});
