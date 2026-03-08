import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ShareModal } from './ShareModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback?: string | { defaultValue?: string; count?: number }) => {
      if (typeof fallback === 'string') return fallback;
      if (fallback?.defaultValue) return fallback.defaultValue.replace('{{count}}', String(fallback.count ?? ''));
      return _key;
    },
  }),
}));

describe('ShareModal', () => {
  it('shows the room id with a simplified privacy note', () => {
    render(
      <ShareModal
        isOpen
        onClose={vi.fn()}
        onCopyInvite={vi.fn()}
        roomId="abc-room"
        status="fallback"
        viewerCount={1}
      />
    );

    expect(screen.getByText('Share design')).toBeTruthy();
    expect(screen.getByText('abc-room')).toBeTruthy();
    expect(screen.getByText('All your diagram data stays local in the browser unless you export it.')).toBeTruthy();
    expect(screen.getByText('Copy Link')).toBeTruthy();
  });

  it('copies the collaboration link', () => {
    const onCopyInvite = vi.fn();

    render(
      <ShareModal
        isOpen
        onClose={vi.fn()}
        onCopyInvite={onCopyInvite}
        roomId="abc-room"
        status="realtime"
        viewerCount={2}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Copy Link/i }));

    expect(onCopyInvite).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Live sync')).toBeTruthy();
  });
});
