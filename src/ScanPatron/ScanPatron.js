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
// import PatronAccessDetail from '../PatronAccessDetail';

const ScanPatron = ({ mutator, resources }) => {
  const isUserProfilePicConfigEnabledForTenant = get(resources, 'userProfilePicConfig.records[0].enabled');
  const [scannedPatronDetails, setScannedPatronDetails] = useState();

  const handleScanPatron = async (barcode) => {
    if (barcode) {
      const query = `barcode==${barcode}`;
      const patron = await mutator.patrons.GET({ params: { query } });
      if (patron.length) {
        setScannedPatronDetails(patron[0]);
      } else {
        setScannedPatronDetails();
      }
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
        onClick={() => {}}
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
        footer={footer}
      >
        <ScanForm
          onSubmit={() => {}}
          handleScanPatron={handleScanPatron}
        />
        {
          scannedPatronDetails && (
            <>
              <PatronDetail
                user={scannedPatronDetails}
                isUserProfilePicConfigEnabledForTenant={isUserProfilePicConfigEnabledForTenant}
                mutator={mutator}
              />
              {/* <PatronAccessDetail /> */}
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
    accumulate: 'true',
    abortOnUnmount: true,
    fetch: false,
  },
  userProfilePicConfig: {
    type: 'okapi',
    path: 'users/configurations/entry',
    fetch: true,
  },
};

ScanPatron.propTypes = {
  mutator: PropTypes.shape({
    patrons: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }).isRequired,
    userProfilePicConfig: PropTypes.object.isRequired,
  }),
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(ScanPatron);
