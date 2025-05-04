import { resetIngresses } from './../../actions/ingress'; // ← adjust path

// Mock classes outside of Jest auto-mock to avoid ESM transform issues
const mockListIngress = jest.fn();
const mockDeleteIngress = jest.fn();
const mockListRooms = jest.fn();
const mockDeleteRoom = jest.fn();

// Manually mock the livekit-server-sdk classes
jest.mock('livekit-server-sdk', () => {
  return {
    IngressClient: jest.fn().mockImplementation(() => ({
      listIngress: mockListIngress,
      deleteIngress: mockDeleteIngress,
    })),
    RoomServiceClient: jest.fn().mockImplementation(() => ({
      listRooms: mockListRooms,
      deleteRoom: mockDeleteRoom,
    })),
  };
});

describe('resetIngresses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete all rooms and ingresses for a host', async () => {
    const fakeRooms = [{ name: 'room1' }, { name: 'room2' }];
    const fakeIngresses = [{ ingressId: 'ingress1' }, { ingressId: 'ingress2' }];

    mockListRooms.mockResolvedValue(fakeRooms);
    mockDeleteRoom.mockResolvedValue(undefined);
    mockListIngress.mockResolvedValue(fakeIngresses);
    mockDeleteIngress.mockResolvedValue(undefined);

    await resetIngresses('test-host');

    expect(mockListRooms).toHaveBeenCalledWith(['test-host']);
    expect(mockDeleteRoom).toHaveBeenCalledTimes(2);
    expect(mockDeleteRoom).toHaveBeenCalledWith('room1');
    expect(mockDeleteRoom).toHaveBeenCalledWith('room2');

    expect(mockListIngress).toHaveBeenCalledWith({ roomName: 'test-host' });
    expect(mockDeleteIngress).toHaveBeenCalledTimes(2);
    expect(mockDeleteIngress).toHaveBeenCalledWith('ingress1');
    expect(mockDeleteIngress).toHaveBeenCalledWith('ingress2');
  });

  it('should skip ingress deletion if ingressId is missing', async () => {
    const fakeRooms = [{ name: 'room' }];
    const fakeIngresses = [{}, { ingressId: 'ingressX' }];

    mockListRooms.mockResolvedValue(fakeRooms);
    mockDeleteRoom.mockResolvedValue(undefined);
    mockListIngress.mockResolvedValue(fakeIngresses);
    mockDeleteIngress.mockResolvedValue(undefined);

    await resetIngresses('another-host');

    expect(mockDeleteRoom).toHaveBeenCalledWith('room');
    expect(mockDeleteIngress).toHaveBeenCalledTimes(1);
    expect(mockDeleteIngress).toHaveBeenCalledWith('ingressX');
  });
});
