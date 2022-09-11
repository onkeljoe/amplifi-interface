import styled from "styled-components";

export const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-right: 1rem;

  @media (max-width: 1080px) {
    width: 100%;
    margin: 0;
    padding-right: 0;
  }
`;

// export const MediumHeaderWrapper = styled.div`
//   display: none;
//   ${({ theme }) => theme.mediaWidth.upToLarge`
//     display: initial;
//   `};
// `;
