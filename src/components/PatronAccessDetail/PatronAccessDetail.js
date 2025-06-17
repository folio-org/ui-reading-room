import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { MessageBanner } from '@folio/stripes/components';

import { ALLOWED } from '../../../constants';
import css from './PatronAccessDetail.css';

const PatronAccessDetail = ({ rraPermission, active }) => {
  const intl = useIntl();

  const { access, notes, readingRoomName } = rraPermission;
  const isAccessAllowed = access === ALLOWED;

  return (
    <MessageBanner
      type={isAccessAllowed && active ? 'success' : 'warning'}
      contentClassName={css.contentClassName}
    >
      <div>
        {active
          ? (
            <>
              {readingRoomName}:&nbsp;
              {intl.formatMessage({ id: isAccessAllowed ? 'ui-reading-room.allowAccess' : 'ui-reading-room.denyAccess' })}
            </>
          )
          : intl.formatMessage({ id: 'ui-reading-room.inactiveUser' })
        }
      </div>
      {notes && intl.formatMessage({ id: 'ui-reading-room.note' }, { notes })}
    </MessageBanner>
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
