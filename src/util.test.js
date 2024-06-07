import { getFullName } from './util';

describe('util', () => {
  describe('getFullName', () => {
    it('when user has lastName and preferredFirstname', () => {
      const user = {
        personal: {
          lastName: 'lastName',
          preferredFirstName: 'preferredFirstName',
        }
      };
      expect(getFullName(user)).toEqual('lastName, preferredFirstName');
    });

    it('when user has lastName and firstName', () => {
      const user = {
        personal: {
          lastName: 'lastName',
          firstName: 'firstName',
        }
      };
      expect(getFullName(user)).toEqual('lastName, firstName');
    });

    it('when user has firstName only ', () => {
      const user = {
        personal: {
          firstName: 'firstName',
        }
      };
      expect(getFullName(user)).toEqual(', firstName');
    });

    it('when user has lastName only ', () => {
      const user = {
        personal: {
          lastName: 'lastName',
        }
      };
      expect(getFullName(user)).toEqual('lastName, ');
    });
  });
});
