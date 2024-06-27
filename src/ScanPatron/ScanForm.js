import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

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

import Footer from '../components/Footer';
import PatronDetail from '../components/PatronDetail';
import PatronAccessDetail from '../components/PatronAccessDetail';
import { ALLOWED } from '../../constants';
import { useReadingRoom, useProfilePicConfigForTenant } from '../hooks';

import css from './ScanForm.css';

const NoReadingRoom = () => (
  <Row>
    <Col xs={10} className={css.noReadingRooms}>
      No reading rooms defined for the current service point
    </Col>
  </Row>
);

const ScanForm = (props) => {
  const {
    handleSubmit,
    form,
    scannedPatronDetails,
    patronRRAPermission,
    resetDetails,
    mutator,
    currUserId,
    loading,
    currSPId,
  } = props;

  const { data: readingRoomData, refetch, isLoading: readingRoomIsLoading } = useReadingRoom(currSPId);
  const isUserProfilePicConfigEnabledForTenant = useProfilePicConfigForTenant();

  useEffect(() => {
    form.change('patronBarcode', '');
    resetDetails();
    refetch();
  // exhaustive-deps check here is disabled as 'patronBarcode' field need not be cleared on every change on form
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, resetDetails, currSPId]);

  const intl = useIntl();
  const displayFooter = scannedPatronDetails?.active && patronRRAPermission && !loading;
  const displayPatronDetails = !!scannedPatronDetails && !loading;
  const readingRoomsDefined = readingRoomData?.readingRooms?.length;

  const selectUser = (user) => {
    form.change('patronBarcode', user.barcode);
    handleSubmit(user.barcode);
  };

  const getTitle = () => (
    <>
      {readingRoomData?.readingRooms.length ? `${readingRoomData.readingRooms?.[0]?.name} . ` : ''}
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
                      disabled={!readingRoomsDefined}
                    />
                  </Col>
                  <Col xs={1}>
                    <Button
                      type="submit"
                      disabled={!readingRoomsDefined}
                    >
                      <FormattedMessage id="ui-reading-room.enter" />
                    </Button>
                  </Col>
                </Row>
                {
                  readingRoomIsLoading ?
                    <Loading /> :
                    readingRoomsDefined ?
                      (
                        <>
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
                          displayPatronDetails && (
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
                          )}
                        </>
                      ) :
                        <NoReadingRoom />
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
  resetDetails : PropTypes.func,
  mutator: PropTypes.object.isRequired,
  currUserId: PropTypes.string.isRequired,
  currSPId: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: false,
})(ScanForm);
