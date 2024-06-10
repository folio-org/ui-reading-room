import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Button,
  Paneset,
  Pane,
  PaneFooter,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import ScanForm from './ScanForm';
import PatronDetail from '../PatronDetail';
import PatronAccessDetail from '../PatronAccessDetail';

const ScanPatron = ({ mutator, resources, stripes }) => {
  const isUserProfilePicConfigEnabledForTenant = get(resources, 'userProfilePicConfig.records[0].enabled');
  const [scannedPatronDetails, setScannedPatronDetails] = useState();
  const [patronRRAPermission, setPatronRRAPermission] = useState();

  const resetScannedPatronDetails = () => {
    setScannedPatronDetails();
  };

  const handleScanPatron = async (barcode) => {
    if (barcode) {
      const query = `barcode==${barcode}`;
      const patron = await mutator.patrons.GET({ params: { query } });

      if (patron.length) {
        const access = await mutator.patronReadingRoomAccess.GET({ params: { servicePointId : stripes?.user?.user?.curServicePoint?.id } });
        setScannedPatronDetails(patron[0]);
        setPatronRRAPermission(access[0]);
      } else {
        resetScannedPatronDetails();
      }
    } else {
      resetScannedPatronDetails();
    }
  };

  const end = (
    <Button
      id="allow-access"
      type="submit"
      buttonStyle="primary"
      onClick={() => {}}
    >
      <FormattedMessage id="ui-reading-room.allow" />
    </Button>
  );

  const start = (
    <>
      <Button
        id="cancel"
        type="button"
        onClick={() => { resetScannedPatronDetails(); }}
      >
        <FormattedMessage id="ui-reading-room.cancel" />
      </Button>
      <Button
        id="deny-access"
        type="submit"
        buttonStyle="danger"
        onClick={() => {}}
      >
        <FormattedMessage id="ui-reading-room.deny" />
      </Button>
    </>
  );

  const footer = (
    <PaneFooter
      renderStart={start}
      renderEnd={end}
    />
  );
  return (
    <Paneset>
      <Pane
        id="reading-room"
        paneTitle={<FormattedMessage id="ui-reading-room.scanPatronCard" />}
        centerContent
        defaultWidth="fill"
        footer={scannedPatronDetails && footer}
      >
        <ScanForm
          onSubmit={() => {}}
          handleScanPatron={handleScanPatron}
        />
        <br />
        {
          scannedPatronDetails && (
            <>
              <PatronDetail
                user={scannedPatronDetails}
                isUserProfilePicConfigEnabledForTenant={isUserProfilePicConfigEnabledForTenant}
                mutator={mutator}
              />
              <br />
              <PatronAccessDetail rraPermission={patronRRAPermission} />
            </>
          )
        }
      </Pane>
    </Paneset>
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
