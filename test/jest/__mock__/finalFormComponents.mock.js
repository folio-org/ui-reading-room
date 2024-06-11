import React from 'react';

jest.mock('react-final-form', () => ({
  Field: jest.fn(({
    component,
    'data-testid': testId,
    ...rest
  }) => (
    <div
      data-testid={testId}
      {...rest}
    >
      {typeof component === 'function' && component(rest)}
      {typeof rest?.children === 'function' && rest.children({
        meta: {},
      })}
    </div>
  )),
}));
