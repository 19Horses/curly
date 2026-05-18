import { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { PROJECT_SURFACE_TIMING } from '../constants/projectSurface';
import pauseSrc from '../assets/pause.svg';
import playSrc from '../assets/play.svg';
import { useGetSong, type SongType } from '../queries/useGetSong';
import { fadeIn } from '../styles/animations';

const progressPink = '#ec4899';

const trackRuleThickness = '2px';

const TrackIconSlot = styled.span`
  position: absolute;
  left: 100%;
  top: 50%;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  max-width: 0;
  margin-left: 0;
  opacity: 0;
  pointer-events: none;
  transform: translate(calc(-1 * 0.4em), -50%);
  transition: max-width 0.28s ease, margin-left 0.28s ease, opacity 0.28s ease,
    transform 0.28s ease;
`;

/** Title + rule column; line width matches the text button only. */
const TrackTitleStack = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  width: max-content;
  max-width: 100%;
`;

const TrackBlock = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  width: max-content;
  max-width: 100%;
  animation: ${fadeIn} 0.5s ease-out both;
  animation-delay: 0.08s;
`;

const TrackIcon = styled.img<{ $lightOnDark: boolean }>`
  width: 0.78rem;
  height: 0.78rem;
  display: block;
  flex-shrink: 0;
  ${({ $lightOnDark }) =>
    $lightOnDark ? 'filter: invert(1);' : 'filter: none;'}
`;

const TrackMeta = styled.button<{ $lightOnDark: boolean }>`
  position: relative;
  appearance: none;
  border: none;
  margin: 0;
  padding: 0;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
  font-weight: normal;
  font-size: clamp(0.78rem, 0.7rem + 0.3vw, 0.95rem);
  line-height: 1.25;
  color: ${({ $lightOnDark }) => ($lightOnDark ? '#ffffff' : 'inherit')};
  transition: color ${PROJECT_SURFACE_TIMING};
  display: block;
  align-self: flex-start;
  width: max-content;
  max-width: 100%;

  &:hover ${TrackIconSlot} {
    max-width: 1.05rem;
    margin-left: 0.35em;
    opacity: 1;
    transform: translate(0, -50%);
  }
`;

const TrackMetaLabel = styled.span`
  display: block;
`;

const TrackRuleTrack = styled.div`
  position: relative;
  width: 100%;
  margin-top: 0;
  min-height: 0.9rem;
  cursor: crosshair;
  user-select: none;
`;

const TrackRuleBase = styled.div<{ $lightOnDark: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: ${trackRuleThickness};
  transform: translateY(-50%);
  background: ${({ $lightOnDark }) => ($lightOnDark ? '#ffffff' : '#000000')};
  transition: background-color ${PROJECT_SURFACE_TIMING};
  pointer-events: none;
`;

const TrackRuleProgress = styled.div<{ $p: number }>`
  position: absolute;
  left: 0;
  top: 50%;
  height: ${trackRuleThickness};
  width: 100%;
  transform: translateY(-50%)
    scaleX(${({ $p }) => Math.min(1, Math.max(0, $p))});
  transform-origin: left center;
  background: ${progressPink};
  z-index: 1;
  pointer-events: none;
  transition: transform 0.2s ease-out;
`;

const VisuallyHiddenAudio = styled.audio`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
`;

export type HeaderAudioTrackProps = {
  lightOnDark: boolean;
};

function isCompleteSong(song: SongType | null | undefined): song is SongType & {
  title: string;
  artist: string;
  audioUrl: string;
} {
  if (!song) return false;
  const title = typeof song.title === 'string' ? song.title.trim() : '';
  const artist = typeof song.artist === 'string' ? song.artist.trim() : '';
  const url = typeof song.audioUrl === 'string' ? song.audioUrl.trim() : '';
  return Boolean(title && artist && url);
}

export function HeaderAudioTrack({ lightOnDark }: HeaderAudioTrackProps) {
  const { data: song, isPending } = useGetSong();
  const completeSong = !isPending && isCompleteSong(song) ? song : null;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, []);

  useEffect(() => {
    if (!completeSong) return;
    const el = audioRef.current;
    if (!el) return;

    const syncPlaying = () => setIsPlaying(!el.paused);
    syncPlaying();
    el.addEventListener('play', syncPlaying);
    el.addEventListener('pause', syncPlaying);
    el.addEventListener('ended', syncPlaying);

    const sync = () => {
      const d = el.duration;
      if (!d || !Number.isFinite(d) || d <= 0) {
        setTrackProgress(0);
        return;
      }
      setTrackProgress(el.currentTime / d);
    };

    const onEnded = () => setTrackProgress(1);

    el.addEventListener('timeupdate', sync);
    el.addEventListener('loadedmetadata', sync);
    el.addEventListener('ended', onEnded);

    return () => {
      el.removeEventListener('play', syncPlaying);
      el.removeEventListener('pause', syncPlaying);
      el.removeEventListener('ended', syncPlaying);
      el.removeEventListener('timeupdate', sync);
      el.removeEventListener('loadedmetadata', sync);
      el.removeEventListener('ended', onEnded);
    };
  }, [completeSong]);

  const seekFromClientX = useCallback(
    (clientX: number, currentTarget: HTMLDivElement) => {
      const audio = audioRef.current;
      if (!audio) return;
      const d = audio.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      const rect = currentTarget.getBoundingClientRect();
      if (rect.width <= 0) return;
      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width)
      );
      audio.currentTime = ratio * d;
      setTrackProgress(ratio);
    },
    []
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      seekFromClientX(e.clientX, e.currentTarget);
    },
    [seekFromClientX]
  );

  if (!completeSong) {
    return null;
  }

  const trackLabel = `${completeSong.artist} - ${completeSong.title}`;
  const audioSrc = completeSong.audioUrl;

  return (
    <>
      <TrackBlock>
        <TrackTitleStack>
          <TrackMeta
            type="button"
            $lightOnDark={lightOnDark}
            aria-label={isPlaying ? 'Pause track' : 'Play track'}
            onClick={togglePlayback}
          >
            <TrackMetaLabel>{trackLabel}</TrackMetaLabel>
            <TrackIconSlot aria-hidden>
              {isPlaying ? (
                <TrackIcon src={pauseSrc} alt="" $lightOnDark={lightOnDark} />
              ) : (
                <TrackIcon src={playSrc} alt="" $lightOnDark={lightOnDark} />
              )}
            </TrackIconSlot>
          </TrackMeta>
          <TrackRuleTrack
            onClick={handleTrackClick}
            aria-label="Seek audio"
            title="Click to seek"
          >
            <TrackRuleBase $lightOnDark={lightOnDark} />
            <TrackRuleProgress $p={trackProgress} />
          </TrackRuleTrack>
        </TrackTitleStack>
      </TrackBlock>
      <VisuallyHiddenAudio
        key={audioSrc}
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        playsInline
      />
    </>
  );
}
