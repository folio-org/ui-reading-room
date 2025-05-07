import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ViewMetaData: jest.fn(({ metadata, ...rest }) => (
    <div {...rest}>{metadata.createdDate}</div>
  )),
  ProfilePicture: () => <div>ProfilePicture</div>,
  NotesSmartAccordion: jest.fn(() => <div>NotesSmartAccordion</div>),
}));
