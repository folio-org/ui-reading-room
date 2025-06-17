import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import { useManualPatronBlocks } from '../useManualPatronBlocks';
import { useAutomatedPatronBlocks } from '../useAutomatedPatronBlocks';
import usePatronBlocks from './usePatronBlocks';

const mockDayjsInstance = {
  endOf: jest.fn().mockReturnThis(),
  isSameOrAfter: jest.fn()
};

jest.mock('@folio/stripes/components', () => ({
  dayjs: jest.fn().mockImplementation(() => mockDayjsInstance)
}));

jest.mock('../useManualPatronBlocks', () => ({
  useManualPatronBlocks: jest.fn(),
}));

jest.mock('../useAutomatedPatronBlocks', () => ({
  useAutomatedPatronBlocks: jest.fn(),
}));

describe('usePatronBlocks', () => {
  const userId = 'test-user-id';
  const mockStripes = {
    hasPerm: jest.fn(),
  };

  const today = '2025-06-17T12:00:00.000Z';
  const tomorrow = '2025-06-18T12:00:00.000Z';
  const yesterday = '2025-06-16T12:00:00.000Z';

  beforeEach(() => {
    jest.clearAllMocks();
    useStripes.mockReturnValue(mockStripes);
    mockDayjsInstance.isSameOrAfter.mockReset();

    useAutomatedPatronBlocks.mockReturnValue({
      automatedPatronBlocks: [],
      isLoadingAutomatedPatronBlocks: false,
    });

    useManualPatronBlocks.mockReturnValue({
      manualPatronBlocks: [],
      isLoadingManualPatronBlocks: false,
    });
  });

  it('should return empty array when user does not have permissions', () => {
    mockStripes.hasPerm.mockReturnValue(false);

    const { result } = renderHook(() => usePatronBlocks({ userId }));

    expect(mockStripes.hasPerm).toHaveBeenCalledWith('ui-reading-room.patron-blocks.view');
    expect(result.current).toEqual({
      patronBlocks: [],
      isLoading: false
    });
  });
  it('should combine and filter out expired blocks', () => {
    mockStripes.hasPerm.mockReturnValue(true);

    const manualBlocks = [
      { id: 'manual-1', type: 'Manual', expirationDate: tomorrow, metadata: { createdDate: today } },
      { id: 'manual-2', type: 'Manual', expirationDate: yesterday, metadata: { createdDate: yesterday } },
    ];

    const automatedBlocks = [
      { id: 'auto-1', type: 'Auto', expirationDate: tomorrow, metadata: { createdDate: today } },
      { id: 'auto-2', type: 'Auto', expirationDate: today, metadata: { createdDate: yesterday } },
    ];

    useManualPatronBlocks.mockReturnValue({
      manualPatronBlocks: manualBlocks,
      isLoadingManualPatronBlocks: false,
    });

    useAutomatedPatronBlocks.mockReturnValue({
      automatedPatronBlocks: automatedBlocks,
      isLoadingAutomatedPatronBlocks: false,
    });

    mockDayjsInstance.isSameOrAfter
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);

    const { result } = renderHook(() => usePatronBlocks({ userId }));

    expect(result.current.patronBlocks).toHaveLength(3);
  });
  it('should sort blocks by created date in descending order', () => {
    mockStripes.hasPerm.mockReturnValue(true);

    const recentBlock = { id: 'recent', type: 'Manual', expirationDate: tomorrow, metadata: { createdDate: today } };
    const olderBlock = { id: 'older', type: 'Auto', expirationDate: tomorrow, metadata: { createdDate: yesterday } };

    useManualPatronBlocks.mockReturnValue({
      manualPatronBlocks: [recentBlock],
      isLoadingManualPatronBlocks: false,
    });

    useAutomatedPatronBlocks.mockReturnValue({
      automatedPatronBlocks: [olderBlock],
      isLoadingAutomatedPatronBlocks: false,
    });

    mockDayjsInstance.isSameOrAfter
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);

    const { result } = renderHook(() => usePatronBlocks({ userId }));

    const expectedOrder = [recentBlock, olderBlock];

    expect(result.current.patronBlocks).toEqual(expectedOrder);
  });

  it('should report loading state when either blocks are loading', () => {
    mockStripes.hasPerm.mockReturnValue(true);

    useManualPatronBlocks.mockReturnValue({
      manualPatronBlocks: [],
      isLoadingManualPatronBlocks: true,
    });

    useAutomatedPatronBlocks.mockReturnValue({
      automatedPatronBlocks: [],
      isLoadingAutomatedPatronBlocks: false,
    });

    const { result } = renderHook(() => usePatronBlocks({ userId }));

    expect(result.current.isLoading).toBe(true);

    useManualPatronBlocks.mockReturnValue({
      manualPatronBlocks: [],
      isLoadingManualPatronBlocks: false,
    });

    useAutomatedPatronBlocks.mockReturnValue({
      automatedPatronBlocks: [],
      isLoadingAutomatedPatronBlocks: true,
    });

    const { result: result2 } = renderHook(() => usePatronBlocks({ userId }));

    expect(result2.current.isLoading).toBe(true);
  });
});
