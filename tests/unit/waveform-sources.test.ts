import { describe, expect, test } from 'vitest';

import { getWaveformDecodeSources } from '../../src/renderer/features/timeline/waveform-sources';

describe('renderer/features/timeline/waveform-sources', () => {
  test('uses the camera playback proxy for camera-owned mic waveform decoding', () => {
    expect(
      getWaveformDecodeSources({
        screenPath: '/project/screen.webm',
        cameraPath: '/project/camera.webm',
        audioPath: null,
        audioSource: 'camera',
        hasSystemAudio: false,
        proxyPath: '/project/screen-proxy-v2.mp4',
        cameraProxyPath: '/project/camera-proxy-v2.mp4'
      })
    ).toEqual({
      micPath: '/project/camera-proxy-v2.mp4',
      micSource: 'camera',
      systemPath: null
    });
  });

  test('uses the screen playback proxy for legacy screen-owned mic waveform decoding', () => {
    expect(
      getWaveformDecodeSources({
        screenPath: '/project/screen.webm',
        cameraPath: null,
        audioPath: null,
        audioSource: 'screen',
        hasSystemAudio: true,
        proxyPath: '/project/screen-proxy-v2.mp4',
        cameraProxyPath: null
      })
    ).toEqual({
      micPath: '/project/screen-proxy-v2.mp4',
      micSource: 'screen',
      systemPath: null
    });
  });

  test('keeps external mic audio on its dedicated file while drawing system audio from screen playback', () => {
    expect(
      getWaveformDecodeSources({
        screenPath: '/project/screen.webm',
        cameraPath: null,
        audioPath: '/project/audio.webm',
        audioSource: 'external',
        hasSystemAudio: true,
        proxyPath: '/project/screen-proxy-v2.mp4',
        cameraProxyPath: null
      })
    ).toEqual({
      micPath: '/project/audio.webm',
      micSource: 'external',
      systemPath: '/project/screen-proxy-v2.mp4'
    });
  });

  test('falls back to raw sources before proxies exist', () => {
    expect(
      getWaveformDecodeSources({
        screenPath: '/project/screen.webm',
        cameraPath: '/project/camera.webm',
        audioPath: null,
        audioSource: 'camera',
        hasSystemAudio: true,
        proxyPath: null,
        cameraProxyPath: null
      })
    ).toEqual({
      micPath: '/project/camera.webm',
      micSource: 'camera',
      systemPath: '/project/screen.webm'
    });
  });
});
