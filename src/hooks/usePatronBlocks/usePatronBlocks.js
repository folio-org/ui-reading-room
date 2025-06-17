import { useMemo } from 'react';
import orderBy from 'lodash/orderBy';

import { useStripes } from '@folio/stripes/core';
import { dayjs } from '@folio/stripes/components';

import { useManualPatronBlocks } from '../useManualPatronBlocks';
import { useAutomatedPatronBlocks } from '../useAutomatedPatronBlocks';

const usePatronBlocks = ({ userId }) => {
  const stripes = useStripes();
  const hasViewPerm = stripes.hasPerm('ui-reading-room.patron-blocks.view');

  const {
    manualPatronBlocks,
    isLoadingManualPatronBlocks,
  } = useManualPatronBlocks({ userId, enabled: hasViewPerm });
  const {
    automatedPatronBlocks,
    isLoadingAutomatedPatronBlocks,
  } = useAutomatedPatronBlocks({ userId, enabled: hasViewPerm });

  const patronBlocks = useMemo(() => {
    // The filter keeps only patron blocks where the expiration date is either today or in the future
    const notExpiredPatronBlocks = [...manualPatronBlocks, ...automatedPatronBlocks].filter(patronBlock => {
      return dayjs(patronBlock.expirationDate).endOf('day').isSameOrAfter(dayjs().endOf('day'));
    });

    return orderBy(notExpiredPatronBlocks, ['metadata.createdDate'], ['desc']);
  }, [manualPatronBlocks, automatedPatronBlocks]);

  return {
    patronBlocks,
    isLoading: isLoadingManualPatronBlocks || isLoadingAutomatedPatronBlocks,
  };
};

export default usePatronBlocks;
