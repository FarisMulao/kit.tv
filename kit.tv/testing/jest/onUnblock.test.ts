import { onBlock, onUnblock } from './../../actions/block'; // adjust path if needed
import { blockUser, unblockUser } from '@/lib/block-service';
import { revalidatePath } from 'next/cache';

jest.mock('@/lib/block-service', () => ({
  blockUser: jest.fn(),
  unblockUser: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('block/unblock actions', () => {
  const mockUser = {
    blocked: {
      username: 'johndoe',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('onBlock', () => {
    it('should call blockUser and revalidate paths', async () => {
      (blockUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await onBlock('123');

      expect(blockUser).toHaveBeenCalledWith('123');
      expect(revalidatePath).toHaveBeenCalledWith('/');
      expect(revalidatePath).toHaveBeenCalledWith('/johndoe');
      expect(result).toBe(mockUser);
    });

    it('should only revalidate root if blockUser returns null', async () => {
      (blockUser as jest.Mock).mockResolvedValue(null);

      const result = await onBlock('456');

      expect(blockUser).toHaveBeenCalledWith('456');
      expect(revalidatePath).toHaveBeenCalledWith('/');
      expect(revalidatePath).toHaveBeenCalledTimes(1);
      expect(result).toBe(null);
    });
  });

  describe('onUnblock', () => {
    it('should call unblockUser and revalidate paths', async () => {
      (unblockUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await onUnblock('789');

      expect(unblockUser).toHaveBeenCalledWith('789');
      expect(revalidatePath).toHaveBeenCalledWith('/');
      expect(revalidatePath).toHaveBeenCalledWith('/johndoe');
      expect(result).toBe(mockUser);
    });

    it('should only revalidate root if unblockUser returns null', async () => {
      (unblockUser as jest.Mock).mockResolvedValue(null);

      const result = await onUnblock('101');

      expect(unblockUser).toHaveBeenCalledWith('101');
      expect(revalidatePath).toHaveBeenCalledWith('/');
      expect(revalidatePath).toHaveBeenCalledTimes(1);
      expect(result).toBe(null);
    });
  });
});
