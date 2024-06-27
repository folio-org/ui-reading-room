import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useReadingRoom = (servicePointId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'get-reading-rooms' });

  const { data, refetch } = useQuery(
    {
      queryKey: [namespace, servicePointId],
      queryFn: () => ky.get(`reading-room?query=servicePoints.id==${servicePointId}`).json(),
      enabled: !!servicePointId
    }
  );

  return { data, refetch };
};

export default useReadingRoom;
