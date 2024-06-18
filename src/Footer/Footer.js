import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Col,
  Row,
} from '@folio/stripes/components';

import { ALLOWED, DENIED } from '../../constants';

import css from './Footer.css';

const Footer = ({ resetDetails, form, allowAccess, mutator, readingRoomId, currUserId, patronId }) => {
  const intl = useIntl();

  const handleAccessLog = useCallback((e) => {
    e.preventDefault();
    const access = intl.formatMessage({ id: 'ui-reading-room.allowAccess' }) ? ALLOWED : DENIED;
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
  }, [intl, readingRoomId, currUserId, patronId, mutator.patronAccessLog, form, resetDetails]);

  const handleCancel = () => {
    form.change('patronBarcode', '');
    resetDetails();
  };

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
  form: PropTypes.object.isRequired,
  allowAccess: PropTypes.bool,
  mutator: PropTypes.object.isRequired,
  readingRoomId: PropTypes.string,
  currUserId: PropTypes.string.isRequired,
  patronId: PropTypes.string,
};

export default Footer;
