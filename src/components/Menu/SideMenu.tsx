import React, { useState } from "react";
import styled from "styled-components";
import { RowBetween, RowFixed, RowFlat } from "../Row";
import {
  TYPE,
  ExternalLink,
  BlankInternalLink,
  StyledInternalLink,
} from "../../theme";
import Column, { AutoColumn } from "../Column";
import { ButtonBasic } from "../Button";
import { GitHub, ChevronLeft, X, HelpCircle, Home } from "react-feather";
import "../../theme/extraFonts.css";
import Logo from "../../assets/svg/AmpliFi.svg";
import { Break } from "../../pages/DelegateInfo";
import { useActiveProtocol } from "../../state/governance/hooks";
import { SUPPORTED_PROTOCOLS } from "../../state/governance/reducer";

const Wrapper = styled.div<{ open: boolean }>`
  height: 100vh;
  position: absolute;
  z-index: 2;
  width: ${({ open }) => (open ? "350px" : "88px")};
  background-color: #fff;
  padding: 1rem 0rem;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: space-between;
  border-right: 1px solid #fdeef5;
  transition: width 0.1s linear;
  box-shadow: ${({ open }) =>
    open ? "0px 6px 10px 10px rgba(0, 0, 0, 0.05);" : "none"};
  overflow: auto;

  :hover {
    cursor: ${({ open }) => (open ? "unset" : "pointer")};
  }

  @media (max-width: 1080px) {
    display: none;
  }

  @media (min-width: 1081px) {
    ::-webkit-scrollbar {
      height: 5px;
      width: 6px;
    }

    ::-webkit-scrollbar-track {
      -webkit-border-radius: 10px;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      opacity: 0.1;
      -webkit-border-radius: 10px;
      border-radius: 10px;
      background-color: #c0c1c1;
    }

    ::-webkit-scrollbar-thumb:hover {
      cursor: default;
    }
  }
`;

const MobileHeader = styled.div`
  box-sizing: border-box;
  min-height: 82px;
  width: 100%;
  background-color: rgba(198, 225, 255, 76);
  display: none;
  padding: 1rem;
  position: relative;
  @media (max-width: 1080px) {
    display: initial;
  }
`;

const MobileFAQWrapper = styled.div`
  width: 100%;
  padding: 0 1.25rem;
  padding-bottom: 1rem;
  top: 82px;
  position: absolute;
  margin-left: -1rem;
  box-shadow: 0px 8px 8px 2px rgb(71 156 251 / 50%);
  z-index: 5;
  background-color: rgba(198, 225, 255, 76);
`;

const SybilLogo = styled.div`
  width: 60px;
  height: 50px;
  background-image: url(${Logo});
  background-size: cover;
  outline: none;
`;

const SybilWorkmark = styled.div`
  font-weight: 600;
  font-size: 20px;
  font-style: italic;
`;

export const WrappedListLogo = styled.img<{ color: string }>`
  height: 40px;
  width: 40px;
  border-radius: 50%;

  :hover {
    cursor: pointer;
    border: ${({ color }) => "1px solid " + color};
  }
`;

export const HoverRow = styled(RowFixed)`
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

export default function SideMenu(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [faqOpen, setfaqOpen] = useState(false);
  const [activeProtocol] = useActiveProtocol();
  function closeBoth() {
    setOpen(!open);
    setfaqOpen(false);
  }

  return (
    <>
      <MobileHeader>
        {!faqOpen ? (
          <RowBetween alignItems='center'>
            <BlankInternalLink to='/'>
              <RowFixed style={{ gap: "8px" }}>
                <SybilLogo />
                <SybilWorkmark>CRE8R AmpliFi</SybilWorkmark>
              </RowFixed>
            </BlankInternalLink>
            <RowFlat style={{ gap: "8px", alignItems: "center" }}>
              <StyledInternalLink to='/'>
                <Home size={20} style={{ stroke: "black" }} />
              </StyledInternalLink>
              <ExternalLink
                href='https://github.com/CRE8RDAO/sybil-interface'
                style={{ display: "flex" }}
              >
                <GitHub size={20} style={{ stroke: "black" }} />
              </ExternalLink>
              <ButtonBasic
                onClick={() => setfaqOpen(!faqOpen)}
                style={{
                  backgroundColor: "rgba(255,255,255,0.4)",
                  color: "#000",
                  padding: 0,
                }}
              >
                <HelpCircle size={20} />
              </ButtonBasic>
            </RowFlat>
          </RowBetween>
        ) : (
          <RowBetween>
            <ButtonBasic
              onClick={() => setfaqOpen(!faqOpen)}
              style={{
                backgroundColor: "rgba(255,255,255,0.4)",
                color: "#000",
                gap: 12,
              }}
            >
              <HelpCircle size={20} />
              <TYPE.black style={{ lineHeight: "125%", fontWeight: 400 }}>
                Help and Info
              </TYPE.black>
            </ButtonBasic>
            <ButtonBasic
              onClick={() => setfaqOpen(!faqOpen)}
              style={{
                cursor: "pointer",
                backgroundColor: "rgba(255,255,255,0.4)",
                color: "#000",
              }}
            >
              <X />
            </ButtonBasic>
          </RowBetween>
        )}
        {faqOpen && (
          <MobileFAQWrapper>
            <AutoColumn gap='1.5rem'>
              <AutoColumn gap='0.5rem'>
                <TYPE.body fontWeight={600}>Why build AmpliFi?</TYPE.body>
                <TYPE.main>
                  Boost CRE8R DAO content marketing campaigns reach. And
                  facilitate KPI based marketing campaigns for web3
                </TYPE.main>
              </AutoColumn>
              <AutoColumn gap='0.5rem'>
                <TYPE.body fontWeight={600}>
                  I don&apos;t have Twitter, can I use AmpliFi?
                </TYPE.body>
                <TYPE.main>
                  Soon Discord, but yes if you DM @CRE8RDAO we can set you
                  up..&nbsp;
                  <ExternalLink href=''>Twitter Link</ExternalLink>.
                </TYPE.main>
              </AutoColumn>
              <AutoColumn gap='0.5rem'>
                <TYPE.body fontWeight={600}>Can I use AmpliFi?</TYPE.body>
                <TYPE.main>
                  Yep, dm @CRE8RDAO on twitter and lets chat!
                </TYPE.main>
              </AutoColumn>
            </AutoColumn>
          </MobileFAQWrapper>
        )}
      </MobileHeader>
      <Wrapper open={open} onClick={() => !open && setOpen(!open)}>
        <AutoColumn gap='24px'>
          <div style={{ padding: "0px 5px 55px 5px", height: "28px" }}>
            {!open ? (
              <SybilLogo />
            ) : (
              <RowBetween align='flex-start'>
                <RowFixed style={{ gap: "8px" }}>
                  <SybilLogo />
                  <SybilWorkmark style={{ fontSize: "40px" }}>
                    AmpliFi
                  </SybilWorkmark>
                </RowFixed>
                <ButtonBasic
                  onClick={() => closeBoth()}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "rgba(255,255,255,0.4)",
                    color: "#000",
                  }}
                >
                  <ChevronLeft />
                </ButtonBasic>
              </RowBetween>
            )}
          </div>
          <div style={{ padding: "0 1.25rem" }}>
            <Break />
          </div>
          {Object.values(SUPPORTED_PROTOCOLS).map((p) => (
            <BlankInternalLink
              key={p.id + "-image-id"}
              to={"/campaigns/" + p.id}
            >
              <HoverRow
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
              >
                <div
                  style={{
                    height: "30px",
                    backgroundColor:
                      activeProtocol?.id === p.id
                        ? activeProtocol?.primaryColor
                        : "transparent",
                    width: "2px",
                  }}
                />

                <div style={{ padding: "0 1.25rem", marginLeft: "-2px" }}>
                  <RowFixed>
                    <WrappedListLogo src={p.logo} color={p.primaryColor} />
                    {open && (
                      <TYPE.mediumHeader
                        fontSize='16px'
                        ml={"12px"}
                        color={p.primaryColor}
                      >
                        {p.name}
                      </TYPE.mediumHeader>
                    )}
                  </RowFixed>
                </div>
              </HoverRow>
            </BlankInternalLink>
          ))}
        </AutoColumn>

        {!faqOpen ? (
          <AutoColumn
            gap='16px'
            style={{
              justifySelf: "flex-end",
              alignItems: "flex-start",
              padding: "0 1.25rem",
            }}
          >
            <StyledInternalLink to='/'>
              <Home size={20} style={{ stroke: "black" }} />
            </StyledInternalLink>
            <ExternalLink
              href='https://github.com/CRE8RDAO/sybil-interface'
              style={{
                backgroundColor: "rgba(255,255,255,0.4)",
                color: "#000",
                gap: 12,
                padding: 0,
              }}
            >
              <GitHub size={20} />
            </ExternalLink>
            <ButtonBasic
              onClick={() => setfaqOpen(!faqOpen)}
              style={{
                backgroundColor: "rgba(255,255,255,0.4)",
                color: "#000",
                padding: 0,
              }}
            >
              <HelpCircle size={20} />
            </ButtonBasic>
            {open && (
              <AutoColumn gap='1rem' style={{ justifySelf: "flex-start" }}>
                <TYPE.black
                  style={{
                    lineHeight: "125%",
                    fontWeight: 400,
                    fontSize: "12px",
                    padding: 0,
                  }}
                >
                  A{" "}
                  <ExternalLink
                    style={{ color: "#ff007a" }}
                    href='https://cre8r.vip/'
                  >
                    CRE8R DAO
                  </ExternalLink>{" "}
                  Project
                </TYPE.black>
              </AutoColumn>
            )}
          </AutoColumn>
        ) : (
          <Column justify='flex-end'>
            <RowBetween style={{ padding: "0 1rem" }}>
              <ButtonBasic
                onClick={() => setfaqOpen(!faqOpen)}
                style={{
                  backgroundColor: "rgba(255,255,255,0.4)",
                  color: "#000",
                  gap: 12,
                }}
              >
                <HelpCircle size={20} />
                <TYPE.black style={{ lineHeight: "125%", fontWeight: 400 }}>
                  Help and Info
                </TYPE.black>
              </ButtonBasic>
              <ButtonBasic
                onClick={() => setfaqOpen(!faqOpen)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgba(255,255,255,0.4)",
                  color: "#000",
                }}
              >
                <X />
              </ButtonBasic>
            </RowBetween>
            <AutoColumn gap='1.5rem' style={{ padding: "0 1.25rem" }}>
              <AutoColumn gap='0.5rem'>
                <TYPE.body fontWeight={600}>Why build AmpliFi?</TYPE.body>
                <TYPE.main>
                  Boost CRE8R DAO content marketing campaigns reach. And
                  facilitate KPI based marketing campaigns for web3
                </TYPE.main>
              </AutoColumn>
              <AutoColumn gap='0.5rem'>
                <TYPE.body fontWeight={600}>
                  I don’t have Twitter, can I use AmpliFi?
                </TYPE.body>
                <TYPE.main>
                  Soon Discord, but yes if you DM @CRE8RDAO we can set you
                  up..&nbsp;
                  <ExternalLink href=''>Twitter Link</ExternalLink>.
                </TYPE.main>
              </AutoColumn>
              <AutoColumn gap='0.5rem'>
                <TYPE.body fontWeight={600}>Can I use AmpliFi?</TYPE.body>
                <TYPE.main>
                  Yep, dm @CRE8RDAO on twitter and lets chat!
                </TYPE.main>
              </AutoColumn>
            </AutoColumn>
          </Column>
        )}

        {/* {faqOpen && (
          
        )} */}
      </Wrapper>
    </>
  );
}
