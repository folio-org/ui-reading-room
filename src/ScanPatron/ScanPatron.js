import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import ScanForm from './ScanForm';

const ScanPatron = ({ mutator, resources, stripes }) => {
  const [scannedPatronDetails, setScannedPatronDetails] = useState();
  const [patronRRAPermission, setPatronRRAPermission] = useState();

  const resetDetails = () => {
    setScannedPatronDetails();
    setPatronRRAPermission();
  };

  const handleScanPatron = async (values) => {
    const { patronBarcode } = values;
    if (patronBarcode) {
      const query = `barcode==${patronBarcode}`;
      const patron = await mutator.patrons.GET({ params: { query } });

      if (patron?.length) {
        const access = await mutator.patronReadingRoomAccess.GET({ params: { servicePointId : stripes?.user?.user?.curServicePoint?.id } });
        setScannedPatronDetails(patron[0]);
        setPatronRRAPermission(access[0]);
      } else {
        resetDetails();
      }
    } else {
      resetDetails();
    }
  };

  return (
    <ScanForm
      onSubmit={handleScanPatron}
      scannedPatronDetails={scannedPatronDetails}
      patronRRAPermission={patronRRAPermission}
      resources={resources}
      resetDetails={resetDetails}
    />
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
  userProfilePicConfig: {
    type: 'okapi',
    path: 'users/configurations/entry',
    fetch: true,
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
  }
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
  }),
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default stripesConnect(ScanPatron);
