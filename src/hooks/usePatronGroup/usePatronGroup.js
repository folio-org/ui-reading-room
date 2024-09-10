import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const usePatronGroup = (patronGroupId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'get-patron-groups' });

  const { data, refetch, isLoading } = useQuery(
    {
      queryKey: [namespace, patronGroupId],
      queryFn: () => ky.get(`groups/${patronGroupId}`).json(),
      enabled: !!patronGroupId
    }
  );

  return { data, refetch, isLoading };
};

export default usePatronGroup;
