import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CaseStudyMuxDock } from '../pages/ProjectPage/styles';
import { useGetCaseStudy } from '../queries/useGetCaseStudy';

export function PersistedCaseStudyMuxPlayer() {
  const { pathname } = useLocation();
  const slugFromRoute = useMemo(() => {
    const m = /^\/projects\/([^/]+)/.exec(pathname);
    return m?.[1];
  }, [pathname]);
  const [lastProjectSlug, setLastProjectSlug] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (slugFromRoute) setLastProjectSlug(slugFromRoute);
  }, [slugFromRoute]);

  const querySlug = slugFromRoute ?? lastProjectSlug;
  const { data, isLoading, isError } = useGetCaseStudy(querySlug);

  const muxPlaybackId =
    querySlug && !isLoading && !isError && data?.videoPlaybackId
      ? data.videoPlaybackId
      : null;

  if (!muxPlaybackId || !data) {
    return null;
  }

  return (
    <CaseStudyMuxDock>
      <MuxPlayer
        key={muxPlaybackId}
        playbackId={muxPlaybackId}
        streamType="on-demand"
        accentColor="#ec4899"
        metadata={{
          video_title: `${data.client} — ${data.title}`,
        }}
      />
    </CaseStudyMuxDock>
  );
}
