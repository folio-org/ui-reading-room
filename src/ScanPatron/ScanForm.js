import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  TextField,
  Col,
  Row,
} from '@folio/stripes/components';
import { Pluggable, useStripes } from '@folio/stripes/core';

const ScanForm = (props) => {
  const { handleSubmit, form, handleScanPatron } = props;
  const intl = useIntl();
  const stripes = useStripes();

  const selectUser = (user) => {
    form.change('patronBarcode', user.barcode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col xs={10}>
          <Field
            id="patronBarcode"
            name="patronBarcode"
            component={TextField}
            placeholder={intl.formatMessage({ id : 'ui-reading-room.scanOrEnterPatronBarcode' })}
          />
        </Col>
        <Col xs={2}>
          <Button
            type="button"
            onClick={() => {
              const formState = form.getState();
              const patronBarcode = formState?.values?.patronBarcode;
              handleScanPatron(patronBarcode);
            }}
          >
            <FormattedMessage id="ui-reading-room.enter" />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Pluggable
            stripes={stripes}
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
        </Col>
      </Row>
    </form>
  );
};

ScanForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleScanPatron: PropTypes.func,
  form: PropTypes.object,
};

export default stripesFinalForm({
  navigationCheck: false,
})(ScanForm);
