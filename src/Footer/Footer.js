import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Col,
  Row,
} from '@folio/stripes/components';
import { useCallout } from '@folio/stripes/core';

import { ALLOWED, DENIED } from '../../constants';

import css from './Footer.css';

const Footer = ({
  resetDetails,
  allowAccess,
  mutator,
  readingRoomId,
  currUserId,
  patronId,
  form,
}) => {
  const intl = useIntl();
  const callout = useCallout();

  const handleCancel = useCallback(() => {
    form.change('patronBarcode', '');
    resetDetails();
  }, [form, resetDetails]);

  const handleAccessLog = useCallback((e) => {
    e.preventDefault();
    const access = e.target.innerHTML === intl.formatMessage({ id: 'ui-reading-room.allowAccess' })?.props?.children[0] ? ALLOWED : DENIED;
    const payload = {
      readingRoomId,
      userId: currUserId,
      patronId,
      action: access
    };

    mutator.patronAccessLog.POST(payload)
      .then(() => {
        callout.sendCallout({
          message: (
            <FormattedMessage id="ui-reading-room.actionSuccess" />
          ),
          type: 'success',
          timeout: 0,
        });
        handleCancel();
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        callout.sendCallout({
          message: (
            <FormattedMessage id="ui-reading-readingRoomId.somethingWentWrong" />
          ),
          type: 'success',
          timeout: 0,
        });
      });
  }, [intl, readingRoomId, currUserId, patronId, mutator.patronAccessLog, callout, handleCancel]);

  return (
    <div className={css.footer}>
      <Row>
        <Col xsOffset={1} xs={3}>
          <Button
            id="cancel"
            type="button"
            buttonStyle="default mega"
            onClick={handleCancel}
          >
            <FormattedMessage id="ui-reading-room.cancel" />
          </Button>
          <Button
            id="deny-access"
            type="submit"
            buttonStyle="danger mega"
            onClick={handleAccessLog}
          >
            <FormattedMessage id="ui-reading-room.denyAccess" />
          </Button>
        </Col>
        <Col xsOffset={6} xs={1}>
          <Button
            id="allow-access"
            type="submit"
            buttonStyle="primary mega"
            onClick={handleAccessLog}
            disabled={!allowAccess}
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
  allowAccess: PropTypes.bool,
  mutator: PropTypes.object.isRequired,
  readingRoomId: PropTypes.string,
  currUserId: PropTypes.string.isRequired,
  patronId: PropTypes.string,
  form: PropTypes.object.isRequired,
};

export default Footer;
