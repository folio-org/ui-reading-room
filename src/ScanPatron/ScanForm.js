import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  TextField,
  Col,
  Row,
  Paneset,
  Pane,
  Loading,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import Footer from '../Footer';
import PatronDetail from '../PatronDetail';
import PatronAccessDetail from '../PatronAccessDetail';
import { ALLOWED } from '../../constants';

import css from './ScanForm.css';

const ScanForm = (props) => {
  const {
    handleSubmit,
    form,
    scannedPatronDetails,
    patronRRAPermission,
    resources,
    resetDetails,
    mutator,
    currUserId,
    readingRoomName,
    loading,
  } = props;

  const isUserProfilePicConfigEnabledForTenant = get(resources, 'userProfilePicConfig.records[0].enabled');
  const displayFooter = scannedPatronDetails && scannedPatronDetails.active && patronRRAPermission && !loading;
  const intl = useIntl();

  const selectUser = (user) => {
    form.change('patronBarcode', user.barcode);
    handleSubmit(user.barcode);
  };

  const getTitle = () => (
    <>
      {readingRoomName ? `${readingRoomName} . ` : ''}
      <FormattedMessage id="ui-reading-room.scanPatronCard" />
    </>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className={css.container}>
        <Paneset static>
          <Pane
            id="reading-room"
            paneTitle={getTitle()}
            centerContent
            defaultWidth="fill"
          >
            <Row>
              <Col
                xsOffset={1}
                xs={10}
              >
                <Row>
                  <Col xs={9}>
                    <Field
                      id="patronBarcode"
                      name="patronBarcode"
                      component={TextField}
                      placeholder={intl.formatMessage({ id : 'ui-reading-room.scanOrEnterPatronBarcode' })}
                    />
                  </Col>
                  <Col xs={1}>
                    <Button
                      type="submit"
                    >
                      <FormattedMessage id="ui-reading-room.enter" />
                    </Button>
                  </Col>
                </Row>
                <div className={css.marginLeft}>
                  <Pluggable
                    data-testid="clickableFindPatronPluggable"
                    aria-haspopup="true"
                    type="find-user"
                    id="clickable-find-user"
                    {...props}
                    searchLabel={<FormattedMessage id="ui-reading-room.patronLookup" />}
                    marginTop0
                    searchButtonStyle="link"
                    dataKey="patrons"
                    selectUser={selectUser}
                  >
                    <FormattedMessage id="ui-reading-room.findUserPluginNotAvailable" />
                  </Pluggable>
                </div>
                <br />
                { loading && <Loading />}
                {
                  scannedPatronDetails && !loading && (
                    <Row>
                      <Col xs={10}>
                        <PatronDetail
                          user={scannedPatronDetails}
                          isUserProfilePicConfigEnabledForTenant={isUserProfilePicConfigEnabledForTenant}
                        />
                        <br />
                        {
                        patronRRAPermission && (
                          <PatronAccessDetail
                            rraPermission={patronRRAPermission}
                            active={scannedPatronDetails.active}
                          />
                        )
                      }
                      </Col>
                    </Row>
                  )
                }
              </Col>
            </Row>
          </Pane>
        </Paneset>
        {
          displayFooter && (
            <Footer
              allowAccess={patronRRAPermission?.access === ALLOWED}
              resetDetails={resetDetails}
              mutator={mutator}
              readingRoomId={patronRRAPermission?.readingRoomId}
              patronId={scannedPatronDetails?.id}
              currUserId={currUserId}
              form={form}
            />
          )
        }
      </div>
    </form>
  );
};

ScanForm.propTypes = {
  handleSubmit: PropTypes.func,
  form: PropTypes.object,
  scannedPatronDetails: PropTypes.object,
  patronRRAPermission: PropTypes.object,
  resources: PropTypes.object,
  resetDetails : PropTypes.func,
  mutator: PropTypes.object.isRequired,
  currUserId: PropTypes.string.isRequired,
  readingRoomName: PropTypes.string,
  loading: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: false,
})(ScanForm);
