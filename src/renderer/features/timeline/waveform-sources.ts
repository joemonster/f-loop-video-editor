import type { AudioSource, Take } from '../../../shared/domain/project';
import { resolveTakeAudio } from '../../../shared/domain/take-audio';
import { getTakePlaybackSources } from './take-playback-sources';

export type WaveformTakeInput = Partial<
  Pick<
    Take,
    | 'screenPath'
    | 'cameraPath'
    | 'audioPath'
    | 'audioSource'
    | 'hasSystemAudio'
    | 'proxyPath'
    | 'cameraProxyPath'
  >
>;

export interface WaveformDecodeSources {
  micPath: string | null;
  micSource: AudioSource | null;
  systemPath: string | null;
}

function resolveMicDecodePath(
  source: AudioSource | null,
  resolvedPath: string | null,
  playbackSources: ReturnType<typeof getTakePlaybackSources>
): string | null {
  if (source === 'camera') return playbackSources.cameraPath || resolvedPath;
  if (source === 'screen') return playbackSources.screenPath || resolvedPath;
  if (source === 'external') return resolvedPath;
  return null;
}

export function getWaveformDecodeSources(
  take: WaveformTakeInput | null | undefined
): WaveformDecodeSources {
  if (!take) {
    return { micPath: null, micSource: null, systemPath: null };
  }

  const playbackSources = getTakePlaybackSources(take);
  const audioResolution = resolveTakeAudio(take);
  const micPath = resolveMicDecodePath(
    audioResolution.source,
    audioResolution.path,
    playbackSources
  );
  const systemPath =
    take.hasSystemAudio === true && audioResolution.source !== 'screen'
      ? playbackSources.screenPath
      : null;

  return {
    micPath,
    micSource: audioResolution.source,
    systemPath
  };
}
