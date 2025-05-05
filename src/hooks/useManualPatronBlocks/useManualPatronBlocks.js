import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useManualPatronBlocks = ({ userId }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'manual-patron-blocks' });

  const { data, isLoading } = useQuery(
    [namespace, userId],
    () => ky.get(`manualblocks?query=(userId==${userId})&limit=10000`).json(),
    {
      enabled: Boolean(userId),
    }
  );


  return {
    manualPatronBlocks: data?.manualblocks || [],
    isLoadingManualPatronBlocks: isLoading,
  };
};

export default useManualPatronBlocks;
