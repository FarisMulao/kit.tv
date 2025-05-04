import { updateStream } from './../../actions/stream'; // adjust
import { db } from '@/lib/db';
import { getSelf } from '@/lib/auth-service';
import { revalidatePath } from 'next/cache';

jest.mock('@/lib/auth-service', () => ({
  getSelf: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    stream: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('updateStream', () => {
  const mockUser = { id: 'user123', username: 'testUser' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the stream and revalidate paths', async () => {
    const mockStream = { id: 'stream123' };
    const updatedStream = { ...mockStream, name: 'New Name' };

    (getSelf as jest.Mock).mockResolvedValue(mockUser);
    (db.stream.findUnique as jest.Mock).mockResolvedValue(mockStream);
    (db.stream.update as jest.Mock).mockResolvedValue(updatedStream);

    const values = {
      name: 'New Name',
      isChatEnabled: true,
      isChatFollowersOnly: false,
      isChatDelayed: false,
    };

    const result = await updateStream(values);

    expect(getSelf).toHaveBeenCalled();
    expect(db.stream.findUnique).toHaveBeenCalledWith({
      where: { userId: mockUser.id },
    });

    expect(db.stream.update).toHaveBeenCalledWith({
      where: { id: mockStream.id },
      data: expect.objectContaining(values),
    });

    expect(revalidatePath).toHaveBeenCalledWith(`/u/${mockUser.username}/chat`);
    expect(revalidatePath).toHaveBeenCalledWith(`/u/${mockUser.username}`);
    expect(revalidatePath).toHaveBeenCalledWith(`/${mockUser.username}`);

    expect(result).toEqual(updatedStream);
  });

  it('should throw an error if stream not found', async () => {
    (getSelf as jest.Mock).mockResolvedValue(mockUser);
    (db.stream.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(updateStream({ name: 'Test' })).rejects.toThrow('Stream not found');
  });

  it('should throw internal error if something fails', async () => {
    (getSelf as jest.Mock).mockRejectedValue(new Error('Unexpected'));

    await expect(updateStream({ name: 'Test' })).rejects.toThrow('Internal error');
  });
});
