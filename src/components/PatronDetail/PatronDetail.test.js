import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import PatronDetail from './PatronDetail';
import { usePatronGroup } from '../../hooks';


jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  usePatronGroup: jest.fn(),
}));

const mockUsePatronGroupService = {
  data: {
    group: 'patronGroup'
  },
  isLoading: false,
};

describe('PatronDetail', () => {
  beforeEach(() => {
    usePatronGroup
      .mockClear()
      .mockReturnValue(mockUsePatronGroupService);
  });

  const props = {
    user: {
      personal: {
        lastName: 'lastName',
        firstName: 'firstName',
        profilePictureLink: 'profilePictureLink'
      },
      barcode: 'barcode',
      expirationDate: 'expirationDate',
      patronGroup: 'patronGroup',
      type: 'userType',
    },
    isUserProfilePicConfigEnabledForTenant: true,
  };

  it.each([
    ['First name', 'ui-reading-room.userDetail.firstName'],
    ['Last name', 'ui-reading-room.userDetail.lastName'],
    ['Patron Group', 'ui-reading-room.userDetail.patronGroup'],
    ['User Type', 'ui-reading-room.userDetail.userType'],
    ['Barcode', 'ui-reading-room.userDetail.barcode'],
    ['Expiration', 'ui-reading-room.userDetail.expiration'],
  ])('should render %s', (value, id) => {
    render(<PatronDetail {...props} />);
    expect(screen.getByText(`${id}`)).toBeInTheDocument();
  });

  it('should render preferredFirstName', () => {
    const alteredProps = {
      ...props,
      user: {
        ...props.user,
        personal: {
          ...props.user.personal,
          preferredFirstName: 'preferredFirstName'
        }
      }
    };
    render(<PatronDetail {...alteredProps} />);

    expect(screen.getByText('preferredFirstName')).toBeInTheDocument();
  });

  it('should render ProfilePicture', () => {
    render(<PatronDetail {...props} />);
    expect(screen.getByText('ProfilePicture')).toBeDefined();
  });

  it('should not render ProfilePicture', () => {
    const alteredProps = {
      ...props,
      isUserProfilePicConfigEnabledForTenant: false,
    };

    render(<PatronDetail {...alteredProps} />);
    expect(screen.queryByText('ProfilePicture')).toBeNull();
  });

  describe('when user does not have first name, preferred first name, expiration date and user type', () => {
    it('should display a hyphen for each of the values', () => {
      const alteredProps = {
        user: {
          personal: {
            lastName: 'lastName',
            profilePictureLink: 'profilePictureLink'
          },
          barcode: 'barcode',
          patronGroup: 'patronGroup',
        },
        isUserProfilePicConfigEnabledForTenant: true,
      };

      render(<PatronDetail {...alteredProps} />);
      expect(screen.getAllByText('-').length).toBe(3);
    });
  });
});
