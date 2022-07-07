import { hasClientExports } from "apollo-utilities";
import { CASE_STUDY_ACF_FIELDS_CLIPS } from "apollo/queries";
import { LoadingView } from "components/ModalViews";
import gql from "graphql-tag";

const Clips = () => (
  <Query
    query={gql`
      query ClipsQuery {
        caseStudies(first: 10, where: {}) {
          nodes {
            title
            caseStudyAcfFields {
              clipsRepeater {
                clipFile {
                  mediaItemUrl
                }
                clipImage {
                  id
                }
                clipTitle
              }
            }
          }
        }
      }
    `}
  >
    {({ Loading, error, data }) => {
      if (loading) {
        return <h1>loading</h1>;
      }
      console.log(data);
      return (
        <div>
          {data.caseStudies.nodes.map((clipFile, key) => {
            return (
              <div key={key}>
                <H2>{}</H2>
                <video></video>
              </div>
            );
          })}
        </div>
      );
    }}
  </Query>
);

export default Clips;
