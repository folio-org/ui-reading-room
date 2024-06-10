import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';
import { ProfilePicture } from '@folio/stripes/smart-components';

import { getFullName } from '../util';
import css from './PatronDetail.css';

const PatronDetail = memo(({ user, isUserProfilePicConfigEnabledForTenant }) => {
  const profilePictureLink = user?.personal?.profilePictureLink;

  const getUserValue = () => {
    return (
      <Row>
        <Col xs={2}>
          <strong>
            {getFullName(user)}
          </strong>
        </Col>
        <Col xs={2}>
          <FormattedMessage
            id="ui-reading-room.userDetail.barcode"
            tagName="strong"
            className={css.marginRight}
          />
          {' '}
          {user.barcode || <NoValue />}
        </Col>
        <Col xs={2}>
          <FormattedMessage
            id="ui-reading-room.userDetail.expiration"
            tagName="strong"
            className={css.marginRight}
          />
          {' '}
          {user.expirationDate || <NoValue />}
        </Col>
      </Row>
    );
  };

  return (
    <Row>
      <Col xs={isUserProfilePicConfigEnabledForTenant ? 9 : 12} className={css.borrowerDetails}>
        <KeyValue
          label={<FormattedMessage id="ui-reading-room.borrower" />}
          value={getUserValue()}
        />
      </Col>
      {isUserProfilePicConfigEnabledForTenant && (
        <Col xs={3}>
          <ProfilePicture profilePictureLink={profilePictureLink} />
        </Col>
      )}
    </Row>
  );
});

PatronDetail.propTypes = {
  user: PropTypes.object,
  isUserProfilePicConfigEnabledForTenant: PropTypes.bool,
};

export default PatronDetail;
