import { onFollow } from './../actions/follow';
import { followUser } from './../lib/follow-service';
import { revalidatePath } from 'next/cache';

jest.mock('./../lib/follow-service', () => ({
  followUser: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('onFollow', () => {
  const mockFollowUser = followUser as jest.Mock;
  const mockRevalidatePath = revalidatePath as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call followUser and revalidate correct paths on success', async () => {
    const mockUser = {
      following: {
        username: 'johndoe'
      }
    };

    mockFollowUser.mockResolvedValue(mockUser);

    const result = await onFollow('123');

    expect(mockFollowUser).toHaveBeenCalledWith('123');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/johndoe');
    expect(result).toBe(mockUser);
  });

  it('should revalidate only root path if followUser returns falsy', async () => {
    mockFollowUser.mockResolvedValue(null);

    const result = await onFollow('456');

    expect(mockFollowUser).toHaveBeenCalledWith('456');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    expect(mockRevalidatePath).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it('should throw "Internal error" if followUser throws', async () => {
    mockFollowUser.mockRejectedValue(new Error('Something went wrong'));

    await expect(onFollow('789')).rejects.toThrow('Internal error');
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});
