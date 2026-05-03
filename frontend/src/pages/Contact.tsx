import styled, { css } from 'styled-components';
import { useGetContact } from '../queries/useGetContact';
import { fadeIn } from '../styles/animations';
import { AddressBlocks } from './AddressBlocks';

const pagePadding = css`
  padding-inline: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  margin-block: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
`;
const viewportCenterNudge = css`
  transform: translateY(calc(-0.5 * clamp(5rem, 14vw, 9rem)));
`;

const narrowScreen = '@media (max-width: 42rem)';

const ContactRoot = styled.section`
  flex: 1;
  width: 100%;
  min-height: 0;
  box-sizing: border-box;
  ${pagePadding}
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${viewportCenterNudge}
`;

const ContactRow = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  gap: clamp(0.5rem, 1vw + 0.2rem, 1rem);
  font-size: clamp(0.8125rem, 0.72rem + 0.45vw, 1.125rem);
  animation: ${fadeIn} 0.5s ease-out both;

  ${narrowScreen} {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.4rem;
    font-size: clamp(0.75rem, 0.68rem + 0.35vw, 1rem);
  }
`;

const ContactTitle = styled.h1`
  margin: 0;
  position: relative;
  z-index: 0;
  flex: 1 1 0;
  min-width: 0;
  align-self: flex-start;
  font-size: clamp(2.75rem, 12vw + 0.5rem, 6.5rem);
  font-weight: bold;
  line-height: 0.95;
  text-transform: lowercase;
`;

const MiddleColumn = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  width: max-content;
  max-width: min(22rem, 88%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  gap: clamp(0.15em, 0.1em + 0.25vw, 0.3em);

  ${narrowScreen} {
    position: static;
    left: auto;
    top: auto;
    z-index: auto;
    transform: none;
    width: 100%;
    max-width: 100%;
    gap: 0.1em;
  }
`;

const RightColumn = styled.div`
  position: relative;
  z-index: 0;
  flex: 1 1 0;
  min-width: 0;
  max-width: min(100%, 22rem);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  font-weight: bold;
  gap: clamp(0.12em, 0.08em + 0.2vw, 0.22em);

  ${narrowScreen} {
    flex: 0 1 auto;
    align-items: flex-start;
    max-width: 100%;
    gap: 0.08em;
  }
`;

const inlineLinkStyles = css`
  color: inherit;
  text-decoration: none;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const EmailText = styled.span`
  overflow-wrap: anywhere;
`;

const ExternalLink = styled.a`
  ${inlineLinkStyles}
  overflow-wrap: anywhere;
`;

export const AddressLine = styled.span`
  display: block;
  overflow-wrap: break-word;
`;

const MessageWrap = styled.div`
  flex: 1;
  width: 100%;
  min-height: 0;
  box-sizing: border-box;
  ${pagePadding}
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${viewportCenterNudge}
`;

const Message = styled.p`
  margin: 0;
`;

function Contact() {
  const { data, isLoading, isError } = useGetContact();

  if (isLoading) {
    return (
      <MessageWrap>
        <Message>Loading…</Message>
      </MessageWrap>
    );
  }

  if (isError || !data) {
    return (
      <MessageWrap>
        <Message>Could not load contact details.</Message>
      </MessageWrap>
    );
  }

  const igHandle = data.instagram.handle.startsWith('@')
    ? data.instagram.handle
    : `@${data.instagram.handle}`;

  return (
    <ContactRoot>
      <ContactRow>
        <ContactTitle>contact</ContactTitle>
        <MiddleColumn>
          <EmailText>{data.email}</EmailText>
          <ExternalLink
            href={data.instagram.link}
            target="_blank"
            rel="noreferrer"
          >
            {igHandle}
          </ExternalLink>
        </MiddleColumn>
        <RightColumn>
          <AddressBlocks blocks={data.address} />
        </RightColumn>
      </ContactRow>
    </ContactRoot>
  );
}

export default Contact;
