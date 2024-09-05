import { useCallout, useStripes } from '@folio/stripes/core';
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
  const sendCallout = jest.fn();

  beforeEach(() => {
    sendCallout.mockClear();
    useCallout.mockClear().mockReturnValue({ sendCallout });
    render(<Footer {...props} />);
  });

  it('should render with no axe errors', async () => {
    await runAxeTest({
      rootNode: document.body,
    });
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

  describe('when clicking "Not allowed" button', () => {
    it('should save access log', async () => {
      await userEvent.click(screen.getByText(buttonNames[1].id));
      expect(props.mutator.patronAccessLog.POST).toHaveBeenCalled();
    });

    it('should display success toaster', async () => {
      await userEvent.click(screen.getByText(buttonNames[1].id));
      expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({
        type: 'success',
      }));
    });
  });

  describe('when clicking "Allowed" button', () => {
    it('should save access log', async () => {
      await userEvent.click(screen.getByText(buttonNames[2].id));
      expect(props.mutator.patronAccessLog.POST).toHaveBeenCalled();
    });

    it('should display success toaster', async () => {
      await userEvent.click(screen.getByText(buttonNames[2].id));
      expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({
        type: 'success',
      }));
    });
  });

  it('should write and error to console when API call to log patron access throws an error', async () => {
    const consoleSpy = jest.spyOn(console, 'error');

    props.mutator.patronAccessLog.POST.mockRejectedValueOnce('Internal server error');
    await userEvent.click(screen.getByText(buttonNames[1].id));
    expect(props.mutator.patronAccessLog.POST).toHaveBeenCalled();

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Internal server error'));

    consoleSpy.mockRestore();
  });
});
