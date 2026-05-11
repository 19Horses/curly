import type { ReactElement } from 'react';
import { styled } from 'styled-components';

const Para = styled.p`
  margin: 0;
  font-size: clamp(0.6875rem, 0.62rem + 0.28vw, 0.9rem);
  line-height: 1.5;

  &:not(:last-child) {
    margin-bottom: 0.65em;
  }
`;

export function BlockParagraphs({ blocks }: { blocks: unknown }) {
  if (!Array.isArray(blocks)) {
    return null;
  }

  const paras: ReactElement[] = [];

  blocks.forEach((block: unknown, i: number) => {
    if (
      typeof block !== 'object' ||
      block === null ||
      (block as { _type?: string })._type !== 'block'
    ) {
      return;
    }
    const b = block as {
      _key?: string;
      children?: Array<{ text?: string }>;
    };
    if (!Array.isArray(b.children)) {
      return;
    }
    const text = b.children
      .map((c) => (typeof c.text === 'string' ? c.text : ''))
      .join('');
    if (!text.trim()) {
      return;
    }
    paras.push(<Para key={b._key ?? `blk-${i}`}>{text}</Para>);
  });

  if (paras.length === 0) {
    return null;
  }

  return <>{paras}</>;
}
