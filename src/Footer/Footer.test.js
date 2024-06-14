import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { userEvent } from '@folio/jest-config-stripes/testing-library/user-event';

import Footer from './Footer';

const buttonNames = [
  {
    name : 'cancel',
    id: 'ui-reading-room.cancel',
  },
  {
    name : 'deny',
    id: 'ui-reading-room.denyAccess',
  },
  {
    name : 'allow',
    id: 'ui-reading-room.allowAccess'
  }
];
describe('Footer', () => {
  const props = {
    resetDetails: jest.fn(),
    form: {
      change: jest.fn(),
    }
  };

  beforeEach(() => {
    render(<Footer {...props} />);
  });

  buttonNames.forEach(button => {
    it(`should render ${button.name} button`, () => {
      expect(screen.getByText(`${button.id}`)).toBeDefined();
    });
  });

  it('should call resetDetails on clicking cancel button', async () => {
    await userEvent.click(screen.getByText(buttonNames[0].id));
    expect(props.resetDetails).toHaveBeenCalled();
  });
});
