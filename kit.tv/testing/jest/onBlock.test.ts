import { onBlock } from '../../server-actions/block'; 
import { blockUser } from '@/lib/block-service';
import { revalidatePath } from 'next/cache';

jest.mock('@/lib/block-service', () => ({
  blockUser: jest.fn(),
  unblockUser: jest.fn(), // in case you test `onUnblock` later
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('onBlock', () => {
    const mockUser = {
      blocked: {
        username: 'johndoe',
      },
    };
  
    beforeEach(() => {
      jest.clearAllMocks(); // 👈 Clears call history for all mocks
    });
  
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
  
