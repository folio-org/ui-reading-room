import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Row,
} from '@folio/stripes/components';

import css from './Footer.css';
import { ALLOWED, DENIED } from '../../constants';

const Footer = ({ resetDetails, form, allow, mutator, readingRoomId, currUserId, patronId }) => {
  const handleAccessLog = useCallback((access) => {
    const payload = {
      readingRoomId,
      userId: currUserId,
      patronId,
      action: access
    };

    mutator.patronAccessLog.POST(payload)
      .then(() => {
        form.change('patronBarcode', '');
        resetDetails();
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }, [readingRoomId, currUserId, patronId, mutator.patronAccessLog, form, resetDetails]);

  return (
    <div className={css.footer}>
      <Row>
        <Col xsOffset={1} xs={3}>
          <Button
            id="cancel"
            type="button"
            buttonStyle="default mega"
            onClick={() => {
              form.change('patronBarcode', '');
              resetDetails();
            }}
          >
            <FormattedMessage id="ui-reading-room.cancel" />
          </Button>
          <Button
            id="deny-access"
            type="submit"
            buttonStyle="danger mega"
            onClick={(e) => {
              e.preventDefault();
              handleAccessLog(DENIED);
            }}
          >
            <FormattedMessage id="ui-reading-room.denyAccess" />
          </Button>
        </Col>
        <Col xsOffset={6} xs={1}>
          <Button
            id="allow-access"
            type="submit"
            buttonStyle="primary mega"
            onClick={(e) => {
              e.preventDefault();
              handleAccessLog(ALLOWED);
            }}
            disabled={!allow}
          >
            <FormattedMessage id="ui-reading-room.allowAccess" />
          </Button>
        </Col>
      </Row>
    </div>
  );
};
Footer.propTypes = {
  resetDetails: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  allow: PropTypes.bool,
  mutator: PropTypes.object.isRequired,
  readingRoomId: PropTypes.string,
  currUserId: PropTypes.string.isRequired,
  patronId: PropTypes.string,
};

export default Footer;
