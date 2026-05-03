import styled from 'styled-components';
import { StaggerRow } from '../components/StaggerRow';
import { AddressLine } from './Contact';

const narrowScreen = '@media (max-width: 42rem)';

const AddressStaggerRow = styled(StaggerRow)`
  ${narrowScreen} {
    align-self: flex-start;
  }
`;

function parseAddressLines(blocks: unknown[]) {
  const lines: { key: string; text: string }[] = [];
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
      children?: Array<{ _type?: string; text?: string }>;
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
    lines.push({ key: b._key ?? `addr-${i}`, text });
  });
  return lines;
}

export function AddressBlocks({ blocks }: { blocks: unknown }) {
  if (!Array.isArray(blocks)) {
    return null;
  }

  const lines = parseAddressLines(blocks);
  if (lines.length === 0) {
    return null;
  }

  return (
    <>
      {lines.map(({ key, text }, staggerIndex) => (
        <AddressStaggerRow
          key={key}
          $staggerIndex={staggerIndex}
          $align="end"
        >
          <AddressLine>{text}</AddressLine>
        </AddressStaggerRow>
      ))}
    </>
  );
}
