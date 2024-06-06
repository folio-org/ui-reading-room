// eslint-disable-next-line import/prefer-default-export
export function getFullName(user) {
  return `${user?.personal?.lastName || ''}, ${user?.personal?.preferredFirstName || user?.personal?.firstName || ''} ${user?.personal?.middleName || ''}`;
}
