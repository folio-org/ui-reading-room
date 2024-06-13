import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Row,
} from '@folio/stripes/components';

import css from './Footer.css';

const Footer = ({ resetDetails, form }) => {
  return (
    <div className={css.footer}>
      <Row>
        <Col xsOffset={1} xs={3}>
          <Button
            id="cancel"
            type="button"
            buttonStyle="default mega"
            onClick={() => {
              form.change('patronBarcode', '');
              resetDetails();
            }}
          >
            <FormattedMessage id="ui-reading-room.cancel" />
          </Button>
          <Button
            id="deny-access"
            type="submit"
            buttonStyle="danger mega"
            onClick={() => {}}
          >
            <FormattedMessage id="ui-reading-room.denyAccess" />
          </Button>
        </Col>
        <Col xsOffset={6} xs={1}>
          <Button
            id="allow-access"
            type="submit"
            buttonStyle="primary mega"
            onClick={() => {}}
          >
            <FormattedMessage id="ui-reading-room.allowAccess" />
          </Button>
        </Col>
      </Row>
    </div>
  );
};
Footer.propTypes = {
  resetDetails: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
};

export default Footer;
