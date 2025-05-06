import React from 'react';
import { IntlProvider } from 'react-intl';
import {
  QueryClientProvider,
  QueryClient,
} from 'react-query'

import { CalloutContext } from '@folio/stripes/core';
import { Router } from 'react-router-dom';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';

const client = new QueryClient({});

let rtlApi;

const renderWithRouter = (children, options = {}) => {
  const history = createMemoryHistory();
  const renderFn = options.rerender ? rtlApi.rerender : render;
  rtlApi = renderFn(
    <Router history={history}>
      <CalloutContext.Provider value={{ sendCallout: () => { } }}>
        <IntlProvider
          locale="en"
          messages={{}}
        >
          <QueryClientProvider client={client}>
            {children}
          </QueryClientProvider>
        </IntlProvider>
      </CalloutContext.Provider>
    </Router>
  );
  return { ...rtlApi, history };
};

export default renderWithRouter;
