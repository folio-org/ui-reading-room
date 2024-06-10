import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  Icon,
} from '@folio/stripes/components';

import { ALLOWED } from '../../constants';
import css from './PatronAccessDetail.css';

const PatronAccessDetail = ({ rraPermission }) => {
  const { access, notes, readingRoomName } = rraPermission;
  const bgClassName = access === ALLOWED ? css.allowed : css.NotAllowed;
  const icon = access === ALLOWED ?
    <Icon icon="check-circle" /> :
    <Icon icon="warning" />;
  const accessString = access === ALLOWED ? <FormattedMessage id="ui-reading-room.allowAccess" /> : <FormattedMessage id="ui-reading-room.denyAccess" />;

  return (
    <Row className={`${bgClassName} ${css.access}`}>
      <Col xs={12}>
        <div
          style={{ display:'flex', flexDirection: 'row', alignItems:'flex-start', justifyContent:'flex-start' }}
        >
          <div className={css.marginRight}>
            {icon}
          </div>
          <div data-testid="roomName-access-notes">
            {readingRoomName}: { accessString }
            <br />
            { notes && <FormattedMessage id="ui-reading-room.note" values={{ notes }} /> }
          </div>
        </div>

      </Col>
    </Row>
  );
};

PatronAccessDetail.propTypes = {
  rraPermission: PropTypes.shape({
    access: PropTypes.string.isRequired,
    notes: PropTypes.string,
    readingRoomName: PropTypes.string.isRequired,
  }),
};

export default PatronAccessDetail;
