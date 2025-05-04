import { createIngress } from './../../actions/ingress'; // Adjust import path
import { ingressClient } from 'livekit-server-sdk'; // Import only for mocking
import { resetIngresses } from './../../actions/ingress';
import { db } from '@/lib/db';
import { getSelf } from '@/lib/auth-service';
import { IngressInput, IngressVideoEncodingPreset, IngressAudioEncodingPreset, IngressVideoOptions, IngressAudioOptions, TrackSource } from 'livekit-server-sdk';

jest.mock('@/lib/auth-service', () => ({
  getSelf: jest.fn(),
}));

jest.mock('../path-to/ingress-utils', () => ({
  resetIngresses: jest.fn(),
}));

jest.mock('livekit-server-sdk', () => {
  return {
    IngressClient: jest.fn().mockImplementation(() => ({
      createIngress: jest.fn(),
    })),
    IngressVideoEncodingPreset: {
      H264_1080P_30FPS_3_LAYERS: 'h264_1080p_30fps_3_layers',
    },
    IngressAudioEncodingPreset: {
      OPUS_STEREO_96KBPS: 'opus_stereo_96kbps',
    },
    IngressVideoOptions: jest.fn().mockImplementation(() => ({
      source: TrackSource.CAMERA,
      encodingOptions: {
        case: 'preset',
        value: 'h264_1080p_30fps_3_layers',
      },
    })),
    IngressAudioOptions: jest.fn().mockImplementation(() => ({
      source: TrackSource.MICROPHONE,
      encodingOptions: {
        case: 'preset',
        value: 'opus_stereo_96kbps',
      },
    })),
    TrackSource: {
      CAMERA: 'camera',
      MICROPHONE: 'microphone',
    },
  };
});

jest.mock('@/lib/db', () => ({
  db: {
    stream: {
      update: jest.fn(),
    },
  },
}));

describe('createIngress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an ingress with video and audio options when input type is not WHIP_INPUT', async () => {
    const mockUser = { id: 'user123', username: 'testUser' };
    const mockIngress = {
      ingressId: 'ingress123',
      url: 'http://example.com/ingress',
      streamKey: 'streamkey123',
    };

    getSelf.mockResolvedValue(mockUser);
    resetIngresses.mockResolvedValue(undefined);
    ingressClient.createIngress.mockResolvedValue(mockIngress);

    const result = await createIngress(IngressInput.CAMERA_INPUT);

    expect(getSelf).toHaveBeenCalled();
    expect(resetIngresses).toHaveBeenCalledWith(mockUser.id);
    expect(ingressClient.createIngress).toHaveBeenCalledWith(IngressInput.CAMERA_INPUT, expect.objectContaining({
      name: mockUser.username,
      roomName: mockUser.id,
      participantName: mockUser.username,
      participantIdentity: mockUser.id,
      video: expect.any(IngressVideoOptions),
      audio: expect.any(IngressAudioOptions),
    }));

    expect(db.stream.update).toHaveBeenCalledWith({
      where: { userId: mockUser.id },
      data: {
        ingressId: 'ingress123',
        serverUrl: 'http://example.com/ingress',
        streamKey: 'streamkey123',
      },
    });

    expect(result).toEqual({
      ingressId: 'ingress123',
      serverUrl: 'http://example.com/ingress',
      streamKey: 'streamkey123',
    });
  });

  it('should create an ingress with WHIP input type and transcoding enabled', async () => {
    const mockUser = { id: 'user123', username: 'testUser' };
    const mockIngress = {
      ingressId: 'ingress456',
      url: 'http://example.com/ingress',
      streamKey: 'streamkey456',
    };

    getSelf.mockResolvedValue(mockUser);
    resetIngresses.mockResolvedValue(undefined);
    ingressClient.createIngress.mockResolvedValue(mockIngress);

    const result = await createIngress(IngressInput.WHIP_INPUT);

    expect(ingressClient.createIngress).toHaveBeenCalledWith(IngressInput.WHIP_INPUT, expect.objectContaining({
      name: mockUser.username,
      roomName: mockUser.id,
      participantName: mockUser.username,
      participantIdentity: mockUser.id,
      enableTranscoding: true,
    }));

    expect(result).toEqual({
      ingressId: 'ingress456',
      serverUrl: 'http://example.com/ingress',
      streamKey: 'streamkey456',
    });
  });

  it('should throw an error if ingress creation fails', async () => {
    const mockUser = { id: 'user123', username: 'testUser' };

    getSelf.mockResolvedValue(mockUser);
    resetIngresses.mockResolvedValue(undefined);
    ingressClient.createIngress.mockResolvedValue(null); // Simulate failure

    await expect(createIngress(IngressInput.CAMERA_INPUT)).rejects.toThrow('Failed to create ingress');
  });
});
