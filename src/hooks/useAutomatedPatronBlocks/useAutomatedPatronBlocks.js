import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useAutomatedPatronBlocks = ({ userId }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'automated-patron-blocks' });

  const { data, isLoading } = useQuery(
    [namespace, userId],
    () => ky.get(`automated-patron-blocks/${userId}?limit=2000`).json(),
    {
      enabled: Boolean(userId),
    }
  );

  return {
    automatedPatronBlocks: data?.automatedPatronBlocks || [],
    isLoadingAutomatedPatronBlocks: isLoading,
  };
};

export default useAutomatedPatronBlocks;
