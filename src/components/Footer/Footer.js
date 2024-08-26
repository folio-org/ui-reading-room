import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Col,
  Row,
} from '@folio/stripes/components';
import { useCallout } from '@folio/stripes/core';

import { ALLOWED, DENIED } from '../../../constants';

import css from './Footer.css';

const Footer = ({
  resetDetails,
  mutator,
  currSPId,
  currUserId,
  patronId,
  rraPermission,
  form,
}) => {
  const intl = useIntl();
  const callout = useCallout();
  const { access, readingRoomId, readingRoomName } = rraPermission;
  const allowAccess = access === ALLOWED;

  const handleCancel = useCallback(() => {
    form.change('patronBarcode', '');
    resetDetails();
  }, [form, resetDetails]);

  const handleAccessLog = useCallback((e) => {
    e.preventDefault();
    const action = e.target.innerHTML === intl.formatMessage({ id: 'ui-reading-room.allowAccess' })?.props?.children[0] ? ALLOWED : DENIED;
    const payload = {
      readingRoomId,
      readingRoomName,
      userId: currUserId,
      patronId,
      action,
      servicePointId: currSPId,
    };

    mutator.patronAccessLog.POST(payload)
      .then(() => {
        callout.sendCallout({
          message: (
            <FormattedMessage id="ui-reading-room.actionSuccess" />
          ),
          type: 'success',
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
        });
      });
  }, [intl, readingRoomId, readingRoomName, currUserId, patronId, currSPId, mutator.patronAccessLog, callout, handleCancel]);

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
  rraPermission: PropTypes.shape({
    access: PropTypes.string.isRequired,
    readingRoomId: PropTypes.string.isRequired,
    readingRoomName: PropTypes.string.isRequired,
  }).isRequired,
  mutator: PropTypes.object.isRequired,
  currSPId: PropTypes.string.isRequired,
  currUserId: PropTypes.string.isRequired,
  patronId: PropTypes.string,
  form: PropTypes.object.isRequired,
};

export default Footer;
