import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Badge: jest.fn((props) => (
    <span>
      <span>{props.children}</span>
    </span>
  )),
  Button: jest.fn(({
    children,
    onClick = jest.fn(),
    // eslint-disable-next-line no-unused-vars
    buttonStyle, buttonRef,
    ...rest
  }) => (
    <button data-test-button type="button" {...rest} onClick={onClick}>
      <span>
        {children}
      </span>
    </button>
  )),
  Col: jest.fn(({ children }) => <div className="col">{ children }</div>),
  Datepicker: jest.fn(({ ref, children, ...rest }) => (
    <div ref={ref} {...rest}>
      {children}
      <input type="text" />
    </div>
  )),
  FormattedDate: jest.fn(({ value, children }) => {
    if (children) {
      return children([value]);
    }

    return value;
  }),
  Headline: jest.fn(({ children }) => <div>{ children }</div>),
  Icon: jest.fn((props) => (props && props.children ? props.children : <span />)),
  IconButton: jest.fn(({
    buttonProps,
    // eslint-disable-next-line no-unused-vars
    iconClassName,
    ...rest
  }) => (
    <button type="button" {...buttonProps}>
      <span {...rest} />
    </button>
  )),
  KeyValue: jest.fn(({ label, children, value }) => (
    <>
      <span>{label}</span>
      <span>{value || children}</span>
    </>
  )),
  Label: jest.fn(({ children, ...rest }) => (
    <span {...rest}>{children}</span>
  )),
  Loading: jest.fn(),
  // oy, dismissible. we need to pull it out of props so it doesn't
  // get applied to the div as an attribute, which must have a string-value,
  // which will shame you in the console:
  //
  //     Warning: Received `true` for a non-boolean attribute `dismissible`.
  //     If you want to write it to the DOM, pass a string instead: dismissible="true" or dismissible={value.toString()}.
  //         in div (created by mockConstructor)
  //
  // is there a better way to throw it away? If we don't destructure and
  // instead access props.label and props.children, then we get a test
  // failure that the modal isn't visible. oy, dismissible.
  Modal: jest.fn(({ children, label, dismissible, footer, ...rest }) => {
    return (
      <div
        data-test={dismissible ? '' : ''}
        {...rest}
      >
        <h1>{label}</h1>
        {children}
        {footer}
      </div>
    );
  }),
  ModalFooter: jest.fn((props) => (
    <div>{props.children}</div>
  )),
  MultiSelection: jest.fn(({ children, dataOptions }) => (
    <div>
      <select multiple>
        {dataOptions.forEach((option, i) => (
          <option
            value={option.value}
            key={option.id || `option-${i}`}
          >
            {option.label}
          </option>
        ))}
      </select>
      {children}
    </div>
  )),
  NavList: jest.fn(({ children, className, ...rest }) => (
    <div className={className} {...rest}>{children}</div>
  )),
  NavListItem: jest.fn(({ children, className, ...rest }) => (
    <div className={className} {...rest}>{children}</div>
  )),
  NavListSection: jest.fn(({ children, className, ...rest }) => (
    <div className={className} {...rest}>{children}</div>
  )),
  Pane: jest.fn(({ children, className, defaultWidth, paneTitle, firstMenu, lastMenu, fluidContentWidth, footer, ...rest }) => {
    return (
      <div className={className} {...rest} style={!fluidContentWidth ? { width: '960px' } : { width: defaultWidth }}>
        <div>
          {firstMenu ?? null}
          {paneTitle}
          {lastMenu ?? null}
        </div>
        {children}
        {footer}
      </div>
    );
  }),
  Paneset: jest.fn(({ children, defaultWidth, ...rest }) => {
    return (
      <div {...rest} style={{ width: defaultWidth }}>
        {children}
      </div>
    );
  }),
  PaneFooter: jest.fn(({ renderEnd, renderStart }) => {
    return (
      <>
        {renderStart}
        {renderEnd}
      </>
    );
  }),
  PaneHeader: jest.fn(({ paneTitle, firstMenu, lastMenu }) => (
    <div>
      {firstMenu ?? null}
      {paneTitle}
      {lastMenu ?? null}
    </div>
  )),
  PaneBackLink: jest.fn(() => <span />),
  PaneMenu: jest.fn((props) => <div>{props.children}</div>),
  RadioButton: jest.fn(({ label, name, ...rest }) => (
    <div>
      <label htmlFor="male">{label}</label>
      <input
        type="radio"
        name={name}
        {...rest}
      />
    </div>
  )),
  RadioButtonGroup: jest.fn(({ label, children, ...rest }) => (
    <fieldset {...rest}>
      <legend>{label}</legend>
      {children}
    </fieldset>
  )),
  Row: jest.fn(({ children }) => <div className="row">{ children }</div>),
  Select: jest.fn(({ children, dataOptions }) => (
    <div>
      <select>
        {dataOptions.forEach((option, i) => (
          <option
            value={option.value}
            key={option.id || `option-${i}`}
          >
            {option.label}
          </option>))}
      </select>
      {children}
    </div>
  )),
  TextField: jest.fn((props) => (
    <div>
      <label htmlFor={props?.name}>{props?.name}</label>
      <input
        {...props}
      />
    </div>
  )),
}));
