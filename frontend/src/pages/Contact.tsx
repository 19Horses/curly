import { useGetContact } from '../queries/useGetContact';

function Contact() {
  const { data, isLoading, isError } = useGetContact();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !data) {
    return <p>Could not load contact details.</p>;
  }

  return (
    <section>
      <h1>Contact</h1>
      <p>{data.email}</p>
      <p>
        Instagram:{' '}
        <a href={data.instagram.link} target="_blank" rel="noreferrer">
          @{data.instagram.handle}
        </a>
      </p>
    </section>
  );
}

export default Contact;
