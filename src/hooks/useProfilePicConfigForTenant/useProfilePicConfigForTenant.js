import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const PROFILE_PICTURE_CONFIG_KEY = 'PROFILE_PICTURE_CONFIG';

const useProfilePicConfigForTenant = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'get-profile-picture-config' });

  const { data } = useQuery({
    queryKey: [namespace],
    queryFn: () => ky.get('users/settings/entries').json(),
  });

  const enabled = data?.settings?.find(setting => setting.key === PROFILE_PICTURE_CONFIG_KEY)?.value?.enabled;

  return enabled;
};

export default useProfilePicConfigForTenant;
