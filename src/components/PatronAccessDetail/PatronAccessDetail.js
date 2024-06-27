import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Icon } from '@folio/stripes/components';

import { ALLOWED } from '../../../constants';
import css from './PatronAccessDetail.css';

const PatronAccessDetail = ({ rraPermission, active }) => {
  const { access, notes, readingRoomName } = rraPermission;
  const bgClassName = active && access === ALLOWED ? css.allowed : css.notAllowed;
  const icon = access === ALLOWED ?
    <Icon icon="check-circle" /> :
    <Icon icon="exclamation-circle" iconClassName={css.denyIcon} />;
  const accessString = access === ALLOWED ? <FormattedMessage id="ui-reading-room.allowAccess" /> : <FormattedMessage id="ui-reading-room.denyAccess" />;

  const renderRRA = () => (
    <>
      <div className={css.marginRight}>
        {icon}
      </div>
      <div data-testid="roomName-access-notes">
        {readingRoomName}: {accessString}
        <br />
        {notes && <FormattedMessage id="ui-reading-room.note" values={{ notes }} />}
      </div>
    </>
  );

  return (
    <div className={`${bgClassName} ${css.access}`}>
      {
        active ?
          renderRRA() :
          <FormattedMessage id="ui-reading-room.inactiveUser" />
      }
    </div>
  );
};

PatronAccessDetail.propTypes = {
  rraPermission: PropTypes.shape({
    access: PropTypes.string.isRequired,
    notes: PropTypes.string,
    readingRoomName: PropTypes.string.isRequired,
  }),
  active: PropTypes.bool.isRequired,
};

export default PatronAccessDetail;
