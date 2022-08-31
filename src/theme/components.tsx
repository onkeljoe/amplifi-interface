import React, { HTMLProps, useCallback } from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { darken } from "polished";
import { ArrowLeft, X } from "react-feather";
import USDC from "../assets/svg/usdc-logo.svg";
import Amplifi from "../assets/images/amplifi-logo-no-text.png";
import CRE8R from "../assets/images/cre8r-logo.png";
import ETH from "../assets/svg/eth-logo.svg";

export const Above1080Only = styled.span`
  display: initial;
  @media (max-width: 1080px) {
    display: none;
  }
`;

export const Below1080Only = styled.span`
  display: none;
  @media (max-width: 1080px) {
    display: initial;
  }
`;

export const OnlyAboveExtraLarge = styled.div`
  display: initial;
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    display: none;
  `};
`;

export const OnlyAboveLarge = styled.div`
  display: initial;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: none;
  `};
`;

export const OnlyAboveMedium = styled.div`
  display: initial;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;

export const OnlyAboveSmall = styled.div`
  display: initial;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

export const OnlyAboveExtraSmall = styled.div`
  display: initial;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

export const OnlyBelowSmall = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: initial;
  `};
`;

export const Button = styled.button.attrs<
  { warning: boolean },
  { backgroundColor: string }
>(({ warning, theme }) => ({
  backgroundColor: warning ? theme.red1 : theme.primary1,
}))`
  padding: 1rem 2rem 1rem 2rem;
  border-radius: 3rem;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ theme }) => theme.white};
  width: 100%;

  :hover {
    background-color: ${({ backgroundColor }) => darken(0.05, backgroundColor)};
  }

  :focus {
    outline-style: solid;
    outline-color: ${({ theme }) => darken(0.05, theme.secondary1)};
  }

  :active {
    background-color: ${({ backgroundColor }) => darken(0.1, backgroundColor)};
  }

  :disabled {
    background-color: ${({ theme }) => theme.bg1};
    color: ${({ theme }) => theme.text4};
    cursor: auto;
  }
`;

export const CloseIcon = styled(X)<{ onClick?: () => void }>`
  cursor: pointer;

  :active {
    stroke: ${({ theme }) => theme.text1};
  }
`;

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button<{ disabled?: boolean }>`
  border: none;
  text-decoration: none;
  background: none;

  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.primary1)};
  font-weight: 500;

  :hover {
    text-decoration: ${({ disabled }) => (disabled ? null : "underline")};
  }

  :focus {
    outline: none;
    text-decoration: ${({ disabled }) => (disabled ? null : "underline")};
  }

  :active {
    text-decoration: none;
  }
`;

// An internal link from the react-router-dom library that is correctly styled
export const StyledInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 400;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`;

export const NoColorInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.black};
  font-weight: 500;
  :hover {
    text-decoration: underline;
  }
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`;

export const BlankInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.black};
  font-weight: 500;

  :hover {
    cursor: pointer;
  }

  :focus {
    outline: none;
  }

  :active {
    text-decoration: none;
  }

  & > * {
    text-decoration: none;
  }
`;

const StyledLink = styled.a<{ color?: string }>`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme, color }) => color ?? theme.primary1};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`;

const rotateImg = keyframes`
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }

  100% {
    transform: perspective(1000px) rotateY(360deg);
  }
`;

export const UniTokenAnimated = styled.img`
  animation: ${rotateImg} 5s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  padding: 2rem 0 0 0;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15));
`;

/**
 * Outbound link that handles firing google analytics events
 */
export function ExternalLink({
  target = "_blank",
  href,
  rel = "noopener noreferrer",
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, "as" | "ref" | "onClick"> & {
  href: string;
}) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === "_blank" || event.ctrlKey || event.metaKey) {
        ReactGA.outboundLink({ label: href }, () => {
          console.debug("Fired outbound link event", href);
        });
      } else {
        event.preventDefault();
        // send a ReactGA event and then trigger a location change
        ReactGA.outboundLink({ label: href }, () => {
          window.location.href = href;
        });
      }
    },
    [href, target]
  );
  return (
    <StyledLink
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      {...rest}
    />
  );
}

export const SolidSectionBreak = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.black};
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.img`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`;

const BackArrowLink = styled(StyledInternalLink)`
  color: ${({ theme }) => theme.text1};
`;
export function BackArrow({ to }: { to: string }) {
  return (
    <BackArrowLink to={to}>
      <ArrowLeft />
    </BackArrowLink>
  );
}

export const BackArrowSimple = styled(ArrowLeft)`
  :hover {
    cursor: pointer;
  }
`;

export const CustomLightSpinner = styled(Spinner)<{ size: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`;

export const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

// styles
export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: ".";
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: ".";
    }
    33% {
      content: "..";
    }
    66% {
      content: "...";
    }
  }
`;

export const GreenIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > * {
    width: 16px;
    stroke: ${({ theme }) => theme.green1};
  }
`;

export const RedIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > * {
    width: 16px;
    stroke: ${({ theme }) => theme.red2};
  }
`;

export const LoadingFlag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.blue1};
  color: ${({ theme }) => theme.blue1};
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 11px;

  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

function switchLogo(name: string) {
  switch (name) {
    case "USDC":
      return USDC;
    case "ETH":
      return ETH;
    case "AMP":
      return Amplifi;
    case "CRE8R":
      return CRE8R;
    default:
      return Amplifi;
  }
}
export const TokenLogo = styled.div<{ name: string }>`
  width: 13px;
  height: 13px;
  background-image: url(${({ name }) => switchLogo(name)});
  background-size: cover;
  outline: none;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.25));
`;

export function HighlightIcon(props: {
  type: "money" | "referree" | "calendar";
}) {
  switch (props.type) {
    case "money":
      return (
        <svg
          width='35'
          height='25'
          viewBox='0 0 35 25'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M5.25 4.0625C5.25 2.19834 6.81953 0.6875 8.75 0.6875H31.5C33.4305 0.6875 35 2.19834 35 4.0625V15.875C35 17.7365 33.4305 19.25 31.5 19.25H8.75C6.81953 19.25 5.25 17.7365 5.25 15.875V4.0625ZM8.75 15.875H12.25C12.25 14.0135 10.6805 12.5 8.75 12.5V15.875ZM8.75 4.0625V7.4375C10.6805 7.4375 12.25 5.92402 12.25 4.0625H8.75ZM31.5 12.5C29.5695 12.5 28 14.0135 28 15.875H31.5V12.5ZM28 4.0625C28 5.92402 29.5695 7.4375 31.5 7.4375V4.0625H28ZM20.125 5.75C17.7078 5.75 15.75 7.63789 15.75 9.96875C15.75 12.2996 17.7078 14.1875 20.125 14.1875C22.5422 14.1875 24.5 12.2996 24.5 9.96875C24.5 7.63789 22.5422 5.75 20.125 5.75ZM2.625 17.9844C2.625 20.0832 4.38812 21.7812 6.5625 21.7812H28.4375C29.1648 21.7812 29.75 22.3455 29.75 23.0469C29.75 23.7482 29.1648 24.3125 28.4375 24.3125H6.5625C2.93836 24.3125 0 21.4807 0 17.9844V5.32812C0 4.62676 0.587891 4.0625 1.3125 4.0625C2.03711 4.0625 2.625 4.62676 2.625 5.32812V17.9844Z'
            fill='black'
          />
        </svg>
      );
    case "calendar":
      return (
        <svg
          width='21'
          height='24'
          viewBox='0 0 21 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M4.5 1.5C4.5 0.671719 5.17031 0 6 0C6.82969 0 7.5 0.671719 7.5 1.5V3H13.5V1.5C13.5 0.671719 14.1703 0 15 0C15.8297 0 16.5 0.671719 16.5 1.5V3H18.75C19.9922 3 21 4.00734 21 5.25V7.5H0V5.25C0 4.00734 1.00734 3 2.25 3H4.5V1.5ZM21 21.75C21 22.9922 19.9922 24 18.75 24H2.25C1.00734 24 0 22.9922 0 21.75V9H21V21.75Z'
            fill='black'
          />
        </svg>
      );
    case "referree":
      return (
        <svg
          width='26'
          height='21'
          viewBox='0 0 26 21'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M13.975 1.96875H15.275C15.8153 1.96875 16.25 2.40967 16.25 2.95312C16.25 3.49658 15.8153 3.9375 15.275 3.9375H13.975V5.84062L18.5534 8.61328C19.1425 8.97012 19.5 9.60996 19.5 10.3031V21H15.6V17.0625C15.6 15.6146 14.4341 14.4375 13 14.4375C11.5659 14.4375 10.4 15.6146 10.4 17.0625V21H6.5V10.3031C6.5 9.60996 6.8575 8.97012 7.44656 8.61328L12.025 5.84062V3.9375H10.725C10.1847 3.9375 9.75 3.49658 9.75 2.95312C9.75 2.40967 10.1847 1.96875 10.725 1.96875H12.025V0.984375C12.025 0.440918 12.4597 0 13 0C13.5403 0 13.975 0.440918 13.975 0.984375V1.96875ZM1.01034 13.5475L5.2 11.2219V21H1.95C0.873031 21 0 20.1182 0 19.0312V15.2742C0 14.5564 0.387156 13.8961 1.01034 13.5475ZM24.05 21H20.8V11.2219L24.9884 13.5475C25.6141 13.8961 26 14.5564 26 15.2742V19.0312C26 20.1182 25.1266 21 24.05 21Z'
            fill='black'
          />
        </svg>
      );
  }
}
