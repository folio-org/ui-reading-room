import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  NoValue,
  FormattedDate,
} from '@folio/stripes/components';
import { ProfilePicture } from '@folio/stripes/smart-components';

import { getFullName } from '../util';
import css from './PatronDetail.css';

const PatronDetail = memo(({ user, isUserProfilePicConfigEnabledForTenant }) => {
  const profilePictureLink = user?.personal?.profilePictureLink;

  const getUserValue = () => {
    return (
      <Row className={css.marginTop}>
        <Col xs={3}>
          <strong>
            {getFullName(user)}
          </strong>
        </Col>
        <Col xs={4}>
          <FormattedMessage
            id="ui-reading-room.userDetail.barcode"
            tagName="strong"
            className={css.marginRight}
          />
          {' '}
          {user.barcode || <NoValue />}
        </Col>
        <Col xs={4}>
          <FormattedMessage
            id="ui-reading-room.userDetail.expiration"
            tagName="strong"
            className={css.marginRight}
          />
          {' '}
          {user.expirationDate ? <FormattedDate value={user.expirationDate} /> : <NoValue />}
        </Col>
      </Row>
    );
  };

  if (!isUserProfilePicConfigEnabledForTenant) {
    return (
      <div className={css.borrowerDetails}>
        <FormattedMessage id="ui-reading-room.borrower" />
        {getUserValue()}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'space-between', justifyContent: 'space-between' }}>
      <div className={`${css.borrowerDetails} ${css.borrowerProfilePic}`}>
        <FormattedMessage id="ui-reading-room.borrower" />
        {getUserValue()}
      </div>
      <div style={{ width:'10px' }} />
      <ProfilePicture profilePictureLink={profilePictureLink} />
    </div>
  );
});

PatronDetail.propTypes = {
  user: PropTypes.object,
  isUserProfilePicConfigEnabledForTenant: PropTypes.bool,
};

export default PatronDetail;
