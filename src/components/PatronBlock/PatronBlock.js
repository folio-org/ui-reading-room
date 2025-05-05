import { useMemo } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import orderBy from 'lodash/orderBy';

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
    const blocks = [...manualPatronBlocks, ...automatedPatronBlocks, {
      'type': 'Manual',
      'desc': 'desc6',
      'staffInformation': 'info6',
      'patronMessage': 'message6',
      'expirationDate': '2025-05-01T00:00:00.000+00:00',
      'borrowing': true,
      'renewals': true,
      'requests': false,
      'userId': '12c71ee8-4856-4f78-9bf4-aa25cdd94de8',
      'metadata': {
        'createdDate': '2025-05-05T12:34:41.116+00:00',
        'createdByUserId': '0542d324-cee5-4ec5-8b72-1c1cca9df828',
        'updatedDate': '2025-05-05T12:34:41.116+00:00',
        'updatedByUserId': '0542d324-cee5-4ec5-8b72-1c1cca9df828'
      },
      'id': 'd418ae2b-52ed-440d-b805-04b25d8a8405'
    }].filter(patronBlock => {
      return dayjs(patronBlock.expirationDate).endOf('day').isSameOrAfter(dayjs().endOf('day'));
    });

    return orderBy(blocks, ['metadata.createdDate'], ['desc']);
  }, [manualPatronBlocks, automatedPatronBlocks]);

  const isLoading = isLoadingManualPatronBlocks || isLoadingAutomatedPatronBlocks;
  const totalRecords = patronBlocks.length;
  const getCellClass = (defaultClass) => `${defaultClass} ${css.cellTopAlign}`;

  const getPatronFormatter = () => {
    return {
      [PATRON_BLOCKS_COLUMNS.type]: f => {
        const type = f?.type ?? intl.formatMessage({ id: 'ui-reading-room.patronBlocks.columns.automated.type' });

        return type;
      },
      [PATRON_BLOCKS_COLUMNS.displayDescription]: f => {
        const description = f.desc || f.message;

        return description;
      },
      [PATRON_BLOCKS_COLUMNS.blockedActions]: f => {
        const blockedActions = [];

        if (f.borrowing || f.blockBorrowing) {
          blockedActions.push([intl.formatMessage({ id: 'ui-reading-room.patronBlocks.columns.borrowing' })]);
        }

        if (f.renewals || f.blockRenewals) {
          blockedActions.push([intl.formatMessage({ id: 'ui-reading-room.patronBlocks.columns.renewals' })]);
        }

        if (f.requests || f.blockRequests) {
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

export default PatronBlock;
