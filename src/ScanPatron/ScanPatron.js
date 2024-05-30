import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Paneset,
  Pane,
  PaneFooter,
} from '@folio/stripes/components';

import ScanForm from './ScanForm';

const ScanPatron = () => {
  const handleScanPatron = () => {
    console.log('In method handleScanPatron');
  };

  const end = (
    <Button
      id="allow-access"
      type="submit"
      buttonStyle="primary"
      onClick={handleScanPatron}
    >
      <FormattedMessage id="ui-reading-room.allow" />
    </Button>
  );

  const start = (
    <Button
      id="deny-access"
      type="submit"
      buttonStyle="danger"
      onClick={handleScanPatron}
    >
      <FormattedMessage id="ui-reading-room.deny" />
    </Button>
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
        />
        {/* )
    }
        /> */}
      </Pane>
    </Paneset>
  );
};

export default ScanPatron;
