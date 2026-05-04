import { StaggerRow } from '../../components/StaggerRow';
import { useGetCaseStudies } from '../../queries/useGetCaseStudies';
import {
  CaseLink,
  CaseList,
  FooterLeft,
  FooterLeftStagger,
  FooterLine,
  FooterRight,
  HomeFooter,
  HomeRoot,
  ListHeading,
} from './styles';

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
