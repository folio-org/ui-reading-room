import { useMemo } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Accordion,
  MultiColumnList,
  Headline,
  Loading,
  dayjs,
  Icon,
  Badge,
} from '@folio/stripes/components';

import {
  useManualPatronBlocks,
  useAutomatedPatronBlocks,
} from '../../hooks';

import css from './PatronBlock.css';

const PATRON_BLOCKS_COLUMNS = {
  type: 'type',
  displayDescription: 'displayDescription',
  blockedActions: 'blockedActions',
};

const columnMapping = {
  [PATRON_BLOCKS_COLUMNS.type]: <FormattedMessage id="ui-reading-room.patronBlocks.columns.type" />,
  [PATRON_BLOCKS_COLUMNS.displayDescription]: <FormattedMessage id="ui-reading-room.patronBlocks.columns.desc" />,
  [PATRON_BLOCKS_COLUMNS.blockedActions]: <FormattedMessage id="ui-reading-room.patronBlocks.columns.blocked" />,
};

const columnWidths = {
  [PATRON_BLOCKS_COLUMNS.type]: '10%',
  [PATRON_BLOCKS_COLUMNS.displayDescription]: '45%',
  [PATRON_BLOCKS_COLUMNS.blockedActions]: '45%',
};

const visibleColumns = [
  PATRON_BLOCKS_COLUMNS.type,
  PATRON_BLOCKS_COLUMNS.displayDescription,
  PATRON_BLOCKS_COLUMNS.blockedActions,
];

const propTypes = {
  userId: PropTypes.string.isRequired,
};

const PatronBlock = ({
  userId,
}) => {
  const intl = useIntl();

  const {
    manualPatronBlocks,
    isLoadingManualPatronBlocks,
  } = useManualPatronBlocks({ userId });
  const {
    automatedPatronBlocks,
    isLoadingAutomatedPatronBlocks,
  } = useAutomatedPatronBlocks({ userId });

  const patronBlocks = useMemo(() => {
    // The filter keeps only patron blocks where the expiration date is either today or in the future
    const notExpiredPatronBlocks = [...manualPatronBlocks, ...automatedPatronBlocks].filter(patronBlock => {
      return dayjs(patronBlock.expirationDate).endOf('day').isSameOrAfter(dayjs().endOf('day'));
    });

    return orderBy(notExpiredPatronBlocks, ['metadata.createdDate'], ['desc']);
  }, [manualPatronBlocks, automatedPatronBlocks]);

  const isLoading = isLoadingManualPatronBlocks || isLoadingAutomatedPatronBlocks;
  const totalRecords = patronBlocks.length;
  const getCellClass = (defaultClass) => `${defaultClass} ${css.cellTopAlign}`;

  const getPatronFormatter = () => {
    return {
      [PATRON_BLOCKS_COLUMNS.type]: patronBlock => {
        const type = patronBlock?.type ?? intl.formatMessage({ id: 'ui-reading-room.patronBlocks.columns.automated.type' });

        return type;
      },
      [PATRON_BLOCKS_COLUMNS.displayDescription]: patronBlock => {
        const description = patronBlock.desc || patronBlock.message;

        return description;
      },
      [PATRON_BLOCKS_COLUMNS.blockedActions]: patronBlock => {
        const blockedActions = [];

        if (patronBlock.borrowing || patronBlock.blockBorrowing) {
          blockedActions.push([intl.formatMessage({ id: 'ui-reading-room.patronBlocks.columns.borrowing' })]);
        }

        if (patronBlock.renewals || patronBlock.blockRenewals) {
          blockedActions.push([intl.formatMessage({ id: 'ui-reading-room.patronBlocks.columns.renewals' })]);
        }

        if (patronBlock.requests || patronBlock.blockRequests) {
          blockedActions.push([intl.formatMessage({ id: 'ui-reading-room.patronBlocks.columns.requests' })]);
        }

        return blockedActions.join(', ');
      }
    };
  };

  const displayWhenClosed = isLoading
    ? <Icon icon="spinner-ellipsis" />
    : <Badge>{totalRecords}</Badge>;

  const title = (
    <Headline
      size="large"
      tag="h3"
    >
      {intl.formatMessage({ id: 'ui-reading-room.patronBlocks.label' })}
    </Headline>
  );

  return (
    <Accordion
      id="patronBlocksSection"
      label={title}
      displayWhenClosed={displayWhenClosed}
    >
      <Row>
        <Col xs>
          {isLoading
            ? <Loading />
            : (
              <MultiColumnList
                id="patron-block-mcl"
                interactive={false}
                contentData={patronBlocks}
                formatter={getPatronFormatter()}
                visibleColumns={visibleColumns}
                columnMapping={columnMapping}
                columnWidths={columnWidths}
                getCellClass={getCellClass}
              />
            )}
        </Col>
      </Row>
    </Accordion>
  );
};

PatronBlock.propTypes = propTypes;

export default PatronBlock;
