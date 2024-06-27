import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useProfilePicConfigForTenant = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'get-profile-picture-config' });

  const { data } = useQuery({
    queryKey: [namespace],
    queryFn: () => ky.get('users/configurations/entry').json(),
  });

  return data?.enabled;
};

export default useProfilePicConfigForTenant;
