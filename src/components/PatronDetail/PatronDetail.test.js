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

  [
    { id: 'ui-reading-room.userDetail.firstName', value: 'First name' },
    { id: 'ui-reading-room.userDetail.lastName', value: 'Last name' },
    { id: 'ui-reading-room.userDetail.patronGroup', value: 'Patron Group' },
    { id: 'ui-reading-room.userDetail.userType', value: 'User Type' },
    { id: 'ui-reading-room.userDetail.barcode', value: 'Barcode' },
    { id: 'ui-reading-room.userDetail.expiration', value: 'Expiration' },
  ].map((item) => (
    it(`should render ${item.value}`, () => {
      render(<PatronDetail {...props} />);
      expect(screen.getByText(`${item.id}`)).toBeInTheDocument();
    })
  ));

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
