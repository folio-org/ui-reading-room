import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import {
  Row,
  Col,
  NoValue,
  FormattedDate,
  KeyValue,
  Loading,
} from '@folio/stripes/components';
import { ProfilePicture } from '@folio/stripes/smart-components';

import css from './PatronDetail.css';
import { usePatronGroup } from '../../hooks';

const PatronDetail = memo(({ user, isUserProfilePicConfigEnabledForTenant }) => {
  const { personal: { firstName, preferredFirstName, lastName, profilePictureLink }, patronGroup, expirationDate, barcode } = user;
  const { data: patronGroupDetails, isLoading: isPatronGroupLoading } = usePatronGroup(patronGroup);

  const renderBorrowerDetails = () => (
    <div
      className={
        classNames(css.borrowerDetails, { [`${css.borrowerWhenProfilePicConfigActive}`]: isUserProfilePicConfigEnabledForTenant })
      }
    >
      <Row>
        <Col xs={2}>
          <KeyValue
            label={
              <FormattedMessage
                id={preferredFirstName ? 'ui-reading-room.userDetail.preferredFirstName' : 'ui-reading-room.userDetail.firstName'}
                tagName="strong"
              />
            }
            value={preferredFirstName || firstName || <NoValue />}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={
              <FormattedMessage
                id="ui-reading-room.userDetail.lastName"
                tagName="strong"
              />
            }
            value={lastName}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={
              <FormattedMessage
                id="ui-reading-room.userDetail.patronGroup"
                tagName="strong"
              />
            }
            value={isPatronGroupLoading ? <Loading /> : patronGroupDetails?.group ?? <NoValue />}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={
              <FormattedMessage
                id="ui-reading-room.userDetail.userType"
                tagName="strong"
              />
            }
            value={user.type || <NoValue />}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={
              <FormattedMessage
                id="ui-reading-room.userDetail.barcode"
                tagName="strong"
              />
            }
            value={barcode || <NoValue />}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={
              <FormattedMessage
                id="ui-reading-room.userDetail.expiration"
                tagName="strong"
              />
            }
            value={expirationDate ? <FormattedDate value={expirationDate} /> : <NoValue />}
          />
        </Col>
      </Row>
    </div>
  );

  if (!isUserProfilePicConfigEnabledForTenant) {
    return renderBorrowerDetails();
  }

  return (
    <div className={css.patronDetailsContainer}>
      {renderBorrowerDetails()}
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
