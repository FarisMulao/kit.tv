import { onUnfollow } from './../../actions/follow';
import { unfollowUser } from './../../lib/follow-service';
import { revalidatePath } from 'next/cache';

jest.mock('./../lib/follow-service', () => ({
  unfollowUser: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('onUnfollow', () => {
  const mockUnfollowUser = unfollowUser as jest.Mock;
  const mockRevalidatePath = revalidatePath as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call unfollowUser and revalidate correct paths on success', async () => {
    const mockUser = {
      following: { username: 'sigma' },
    };

    mockUnfollowUser.mockResolvedValue(mockUser);

    const result = await onUnfollow('123');

    expect(mockUnfollowUser).toHaveBeenCalledWith('123');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/sigma');
    expect(result).toBe(mockUser);
  });

  it('should revalidate only root path if unfollowUser returns null', async () => {
    mockUnfollowUser.mockResolvedValue(null);

    const result = await onUnfollow('456');

    expect(mockUnfollowUser).toHaveBeenCalledWith('456');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    expect(mockRevalidatePath).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it('should throw "Internal error" if unfollowUser throws', async () => {
    mockUnfollowUser.mockRejectedValue(new Error('Something went wrong'));

    await expect(onUnfollow('789')).rejects.toThrow('Internal error');
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});
