import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import PatronDetail from './PatronDetail';

describe('PatronDetail', () => {
  const props = {
    user: {
      personal: {
        lastName: 'lastName',
        firstName: 'firstName',
        profilePictureLink: 'profilePictureLink'
      },
      barcode: 'barcode',
      expirationDate: 'expirationDate',
    },
    isUserProfilePicConfigEnabledForTenant: true,
  };

  it('should render PatronDetail', () => {
    render(<PatronDetail {...props} />);
    expect(screen.getByText('lastName, firstName')).toBeDefined();
  });

  it('should render ProfilePicture', () => {
    render(<PatronDetail {...props} />);
    expect(screen.getByText('ProfilePicture')).toBeDefined();
  });

  it('should render ProfilePicture', () => {
    const alteredProps = {
      ...props,
      isUserProfilePicConfigEnabledForTenant: false,
    };

    render(<PatronDetail {...alteredProps} />);
    expect(screen.queryByText('ProfilePicture')).toBeNull();
  });
});
