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
    },
    allow: true,
    mutator: {
      patronAccessLog : {
        POST: jest.fn().mockResolvedValue(''),
      },
    },
    readingRoomId: 'readingRoomId',
    currUserId: 'currUserId',
    patronId: 'patronId',
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

  it('should save access log on clicking  "Allow access" button', async () => {
    await userEvent.click(screen.getByText(buttonNames[1].id));
    expect(props.mutator.patronAccessLog.POST).toHaveBeenCalled();
  });

  it('should save access log on clicking  "Deny access" button', async () => {
    await userEvent.click(screen.getByText(buttonNames[2].id));
    expect(props.mutator.patronAccessLog.POST).toHaveBeenCalled();
  });
});
