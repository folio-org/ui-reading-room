import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

import ScanForm from './ScanForm';

const ScanPatron = ({ mutator, stripes }) => {
  const [scannedPatronDetails, setScannedPatronDetails] = useState();
  const [patronRRAPermission, setPatronRRAPermission] = useState();
  const [loading, setLoading] = useState(false);

  const resetDetails = useCallback(() => {
    setScannedPatronDetails();
    setPatronRRAPermission();
    setLoading(false);
  }, []);

  const handleScanPatron = async (values) => {
    const { patronBarcode } = values;
    if (patronBarcode) {
      setLoading(true);
      const query = `barcode==${patronBarcode}`;
      const patron = await mutator.patrons.GET({ params: { query } });

      if (patron?.length) {
        const access = await mutator.patronReadingRoomAccess.GET({ params: { servicePointId : stripes?.user?.user?.curServicePoint?.id } });
        setLoading(false);
        setScannedPatronDetails(patron[0]);
        setPatronRRAPermission(access?.[0]);
      } else {
        resetDetails();
      }
    } else {
      resetDetails();
    }
  };

  return (
    stripes?.user?.user?.curServicePoint?.id ?
      <ScanForm
        onSubmit={handleScanPatron}
        scannedPatronDetails={scannedPatronDetails}
        patronRRAPermission={patronRRAPermission}
        resetDetails={resetDetails}
        mutator={mutator}
        currUserId={stripes?.user?.user?.id}
        loading={loading}
        currSPId={stripes?.user?.user?.curServicePoint?.id}
      /> :
      <Loading />
  );
};

ScanPatron.manifest = {
  patrons: {
    type: 'okapi',
    records: 'users',
    path: 'users',
    accumulate: 'false',
    abortOnUnmount: true,
    fetch: false,
  },
  patronReadingRoomAccess: {
    type: 'okapi',
    // eslint-disable-next-line consistent-return, no-unused-vars
    path: (queryParams, pathComponents, resourceData, config, props) => {
      if (resourceData?.patrons?.records?.length) {
        const patronRecords = resourceData.patrons.records;
        return `reading-room-patron-permission/${patronRecords[patronRecords.length - 1].id}`;
      }
    },
    accumulate: 'true',
    abortOnUnmount: true,
    fetch: false,
  },
  patronAccessLog: {
    type: 'okapi',
    throwErrors: false,
    POST: {
      // eslint-disable-next-line consistent-return, no-unused-vars
      path: (queryParams, pathComponents, resourceData) => {
        const patronReadingRoomAccessRecords = resourceData.patron_reading_room_access.records;
        const readingRoomId = patronReadingRoomAccessRecords[patronReadingRoomAccessRecords.length - 1].readingRoomId;
        return `reading-room/${readingRoomId}/access-log`;
      },
    },
    fetch: false
  },
};

ScanPatron.propTypes = {
  mutator: PropTypes.shape({
    patrons: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }).isRequired,
    userProfilePicConfig: PropTypes.object.isRequired,
    patronReadingRoomAccess: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }).isRequired,
    readingRoom: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }).isRequired,
  }),
  stripes: PropTypes.object.isRequired,
};

export default stripesConnect(ScanPatron);
