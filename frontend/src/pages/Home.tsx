import { Link } from 'react-router-dom';
import { styled, css } from 'styled-components';
import { StaggerRow } from '../components/StaggerRow';
import { useGetCaseStudies } from '../queries/useGetCaseStudies';

const HomeRoot = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const footerLinkStyles = css`
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

const HomeFooter = styled.footer`
  margin-top: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: clamp(0.75rem, 2vw + 0.25rem, 2rem);
  padding: clamp(0.75rem, 0.4rem + 2.2vw, 2.5rem);
  font-size: clamp(0.8125rem, 0.72rem + 0.45vw, 1.125rem);
`;

const FooterLeft = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(0.25em, 0.15em + 0.6vw, 0.35em);
`;

const FooterLeftStagger = styled(StaggerRow)`
  width: 100%;
`;

const FooterLine = styled.span`
  display: block;
  margin: 0;
  line-height: 1.38;
  overflow-wrap: break-word;
`;

const FooterRight = styled.div`
  flex: 0 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: clamp(0.25em, 0.15em + 0.6vw, 0.35em);
  text-align: right;
`;

const ListHeading = styled.span`
  display: inline-block;
  font-weight: bold;
  text-transform: lowercase;
  margin-bottom: clamp(0.45em, 0.3em + 0.8vw, 0.7em);
`;

const CaseList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: clamp(0.15em, 0.08em + 0.45vw, 0.25em);
`;

const CaseLink = styled(Link)`
  ${footerLinkStyles}
  overflow-wrap: break-word;
  text-align: right;
`;

function Home() {
  const { data: caseStudies, isLoading, isError } = useGetCaseStudies();

  return (
    <HomeRoot>
      <HomeFooter>
        <FooterLeft>
          <FooterLeftStagger $staggerIndex={0} $align="start">
            <FooterLine>
              <strong>curly</strong> is an independent creative studio.
            </FooterLine>
          </FooterLeftStagger>
          <FooterLeftStagger $staggerIndex={1} $align="start">
            <FooterLine>
              we use world building to create moments in culture.
            </FooterLine>
          </FooterLeftStagger>
        </FooterLeft>
        <FooterRight>
          <StaggerRow $staggerIndex={0} $align="end">
            <ListHeading>worlds we&apos;ve built</ListHeading>
          </StaggerRow>
          {isLoading && <FooterLine>Loading projects…</FooterLine>}
          {isError && <FooterLine>Could not load projects.</FooterLine>}
          {!isLoading && !isError && caseStudies && caseStudies.length > 0 && (
            <CaseList>
              {caseStudies.map((study, index) => (
                <li key={study._id}>
                  <StaggerRow $staggerIndex={index + 1} $align="end">
                    <CaseLink to={`/projects/${study.slug}`}>
                      {study.client} – {study.title}
                    </CaseLink>
                  </StaggerRow>
                </li>
              ))}
            </CaseList>
          )}
          {!isLoading && !isError && caseStudies?.length === 0 && (
            <FooterLine>No projects yet.</FooterLine>
          )}
        </FooterRight>
      </HomeFooter>
    </HomeRoot>
  );
}

export default Home;
