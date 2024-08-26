import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { userEvent } from '@folio/jest-config-stripes/testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';

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
    rraPermission: {
      access: 'ALLOWED',
      readingRoomId: 'readingRoomId',
      readingRoomName: 'readingRoomName',
    },
    mutator: {
      patronAccessLog : {
        POST: jest.fn().mockResolvedValue(''),
      },
    },
    currSPId: 'currSPId',
    currUserId: 'currUserId',
    patronId: 'patronId',
  };

  it('should render with no axe errors', async () => {
    render(<Footer {...props} />);
    await runAxeTest({
      rootNode: document.body,
    });
  });

  buttonNames.forEach(button => {
    it(`should render ${button.name} button`, () => {
      render(<Footer {...props} />);
      expect(screen.getByText(`${button.id}`)).toBeDefined();
    });
  });

  it('should call resetDetails on clicking cancel button', async () => {
    render(<Footer {...props} />);
    await userEvent.click(screen.getByText(buttonNames[0].id));
    expect(props.resetDetails).toHaveBeenCalled();
  });

  it('should save access log on clicking  "Deny access" button', async () => {
    render(<Footer {...props} />);
    await userEvent.click(screen.getByText(buttonNames[1].id));
    expect(props.mutator.patronAccessLog.POST).toHaveBeenCalled();
  });

  it('should save access log on clicking  "Allow access" button', async () => {
    render(<Footer {...props} />);
    await userEvent.click(screen.getByText(buttonNames[2].id));
    expect(props.mutator.patronAccessLog.POST).toHaveBeenCalled();
  });

  it('should write and error to console when API call to log patron access throws an error', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    props.mutator.patronAccessLog.POST.mockRejectedValueOnce('Internal server error');
    render(<Footer {...props} />);
    await userEvent.click(screen.getByText(buttonNames[1].id));
    expect(props.mutator.patronAccessLog.POST).toHaveBeenCalled();

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Internal server error'));

    consoleSpy.mockRestore();
  });
});
