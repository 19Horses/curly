import { useGetContact } from '../../queries/useGetContact';
import { AddressBlocks } from './AddressBlocks';
import {
  ContactRoot,
  ContactRow,
  ContactTitle,
  EmailText,
  ExternalLink,
  Message,
  MessageWrap,
  MiddleColumn,
  RightColumn,
} from './styles';

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
