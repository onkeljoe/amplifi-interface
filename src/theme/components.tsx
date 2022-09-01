import React, { HTMLProps, useCallback } from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { darken } from "polished";
import { ArrowLeft, X } from "react-feather";

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

export function TokenLogo(props: { name: "USDC" | "ETH" | "AMP" | "CRE8R" }) {
  switch (props.name) {
    case "USDC":
      return (
        <svg
          width='13px'
          height='13px'
          data-name='86977684-12db-4850-8f30-233a7c267d11'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 2000 2000'
        >
          <path
            d='M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z'
            fill='#2775ca'
          />
          <path
            d='M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z'
            fill='#fff'
          />
          <path
            d='M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z'
            fill='#fff'
          />
        </svg>
      );
    case "ETH":
      return (
        <svg
          width='13px'
          height='13px'
          viewBox='0 0 32 32'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g fill='none' fillRule='evenodd'>
            <circle cx='16' cy='16' r='16' fill='#627EEA' />
            <g fill='#FFF' fillRule='nonzero'>
              <path fillOpacity='.602' d='M16.498 4v8.87l7.497 3.35z' />
              <path d='M16.498 4L9 16.22l7.498-3.35z' />
              <path fillOpacity='.602' d='M16.498 21.968v6.027L24 17.616z' />
              <path d='M16.498 27.995v-6.028L9 17.616z' />
              <path
                fillOpacity='.2'
                d='M16.498 20.573l7.497-4.353-7.497-3.348z'
              />
              <path fillOpacity='.602' d='M9 16.22l7.498 4.353v-7.701z' />
            </g>
          </g>
        </svg>
      );
    case "AMP":
      return (
        <svg
          version='1.0'
          xmlns='http://www.w3.org/2000/svg'
          width='687.000000pt'
          height='494.000000pt'
          viewBox='0 0 687.000000 494.000000'
          preserveAspectRatio='xMidYMid meet'
          style={{ width: "13px", height: "13px" }}
        >
          <g
            transform='translate(0.000000,494.000000) scale(0.100000,-0.100000)'
            fill='#fff'
            stroke='none'
          >
            <path
              d='M1790 4830 c-327 -24 -575 -122 -639 -253 -15 -31 -21 -63 -21 -113
  l0 -70 -457 -170 c-251 -93 -462 -175 -470 -182 -11 -11 -13 -189 -13 -976 0
  -905 1 -964 18 -979 24 -22 1721 -681 1752 -681 14 1 162 53 329 117 167 65
  310 117 317 117 12 0 65 -36 199 -135 33 -24 85 -61 115 -81 30 -21 78 -56
  105 -79 28 -23 124 -100 215 -170 264 -205 486 -402 765 -676 143 -140 278
  -269 300 -285 61 -47 162 -99 250 -130 75 -26 92 -28 270 -32 210 -4 279 5
  426 59 226 82 433 217 637 413 478 461 804 1138 882 1836 17 147 15 443 -4
  570 -60 417 -225 740 -471 923 -106 79 -216 131 -345 163 -94 23 -119 26 -245
  22 -157 -5 -254 -24 -485 -94 -418 -126 -967 -227 -1362 -250 l-118 -7 0 160
  c0 114 -4 164 -13 177 -7 10 -205 90 -472 191 l-460 173 -5 79 c-9 125 -55
  187 -189 254 -172 86 -505 130 -811 109z m468 -136 c245 -36 412 -124 412
  -217 0 -79 -153 -161 -383 -204 -132 -25 -524 -25 -654 0 -573 109 -483 376
  148 437 120 11 344 4 477 -16z m432 -539 c0 -102 -4 -142 -16 -167 -51 -107
  -296 -192 -591 -205 l-133 -6 0 175 0 175 133 6 c236 11 445 61 557 133 19 13
  38 23 43 23 4 1 7 -60 7 -134z m-1560 -45 c0 -129 3 -156 19 -188 56 -111 213
  -191 466 -238 144 -27 546 -27 690 0 252 47 417 132 466 241 15 33 19 66 19
  188 0 82 4 147 9 145 5 -1 164 -61 355 -133 190 -71 342 -132 338 -136 -10 -8
  -1504 -562 -1517 -562 -18 0 -1549 577 -1539 580 5 2 158 59 339 127 182 69
  336 125 343 125 9 1 12 -35 12 -149z m4778 -201 c378 -86 650 -438 732 -946
  20 -122 28 -325 18 -482 -10 -177 -25 -230 -25 -90 0 129 -10 227 -32 334 -11
  50 -25 117 -31 150 -7 33 -25 98 -40 145 -15 47 -39 122 -54 168 -59 188 -230
  409 -406 526 -90 59 -128 75 -239 98 -78 16 -116 19 -206 13 -125 -7 -300 -41
  -403 -79 -180 -65 -387 -192 -547 -335 l-50 -45 50 53 c274 292 615 479 930
  510 98 9 205 2 303 -20z m-2290 -121 l-3 -103 -115 2 c-128 3 -340 23 -340 32
  0 8 419 169 443 170 16 1 17 -8 15 -101z m1112 -175 c-103 -105 -253 -285
  -357 -429 -174 -241 -327 -547 -428 -854 -54 -165 -68 -226 -85 -366 -17 -135
  -17 -143 -20 -274 -2 -103 -3 -111 -13 -75 -6 24 -11 150 -11 313 l-1 273 -35
  9 c-19 4 -100 25 -180 45 -185 47 -457 137 -630 210 -147 62 -437 207 -566
  282 l-81 48 18 53 c28 81 124 259 182 337 142 191 312 319 497 376 73 22 76
  22 324 10 297 -13 542 -3 836 34 242 31 615 97 629 111 2 2 9 4 15 4 6 0 -36
  -48 -94 -107z m-2025 -76 c-266 -198 -464 -515 -541 -867 -15 -66 -19 -125
  -18 -260 0 -161 3 -182 28 -265 50 -165 132 -286 250 -370 30 -22 56 -42 56
  -45 0 -3 -75 -34 -167 -68 -93 -35 -196 -74 -231 -87 l-62 -24 2 872 3 872
  345 132 c190 72 350 131 355 132 6 0 -3 -10 -20 -22z m1820 -596 l0 -44 -75
  -28 c-119 -46 -110 -47 -110 5 0 59 29 93 90 105 25 5 56 8 70 8 23 -2 25 -6
  25 -46z m257 -151 c15 -30 30 -68 34 -85 5 -29 4 -31 -67 -57 -40 -15 -74 -26
  -75 -25 -3 2 -6 157 -5 185 1 14 59 43 76 39 6 -2 22 -27 37 -57z m-242 -119
  c0 -85 -2 -100 -17 -106 -114 -45 -173 -63 -173 -52 -1 6 -3 51 -6 98 l-6 86
  68 26 c38 15 80 31 94 36 14 5 28 10 33 10 4 1 7 -44 7 -98z m-320 -120 l0
  -100 -56 -21 c-31 -11 -58 -19 -60 -17 -4 4 67 181 87 220 21 38 29 14 29 -82z
  m620 -95 c0 -63 -4 -97 -12 -103 -17 -13 -126 -53 -144 -53 -12 0 -14 18 -12
  97 l3 97 75 27 c41 15 78 28 83 28 4 1 7 -41 7 -93z m-292 -113 l-3 -97 -84
  -33 c-47 -18 -91 -33 -98 -33 -11 0 -13 21 -11 96 l3 97 85 33 c47 18 91 33
  98 33 10 1 12 -22 10 -96z m-326 -35 c2 -7 4 -51 3 -98 l0 -85 -85 -32 c-47
  -18 -91 -32 -99 -33 -11 0 -13 18 -9 90 2 52 9 95 16 102 11 11 144 66 163 67
  4 1 9 -5 11 -11z m2415 -40 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1
  -19z m-1837 -69 c0 -29 -85 -221 -102 -230 -17 -9 -18 -4 -18 94 l0 104 53 21
  c64 24 67 25 67 11z m115 -41 c-10 -64 -41 -175 -71 -259 -38 -106 -102 -199
  -223 -320 -111 -111 -218 -184 -306 -209 -26 -7 -45 -18 -45 -27 0 -22 67
  -178 126 -294 160 -313 385 -557 660 -714 74 -42 84 -45 152 -45 68 0 215 27
  277 50 56 21 34 2 -37 -33 -98 -48 -161 -70 -303 -107 -145 -38 -325 -50 -438
  -30 -361 64 -637 374 -741 830 -34 149 -61 450 -41 450 3 0 25 -10 48 -22 37
  -19 58 -22 167 -22 117 -1 129 1 190 28 100 46 168 93 256 181 130 129 253
  334 306 507 12 43 25 78 26 78 2 0 1 -19 -3 -42z m-365 -146 l0 -98 -90 -33
  c-50 -18 -92 -32 -95 -30 -2 2 -5 47 -7 99 l-3 94 85 33 c47 17 91 32 98 32 9
  1 12 -25 12 -97z m-320 -115 l0 -103 -90 -33 c-50 -18 -93 -32 -95 -30 -6 6
  -9 188 -4 193 4 4 173 72 187 75 1 1 2 -45 2 -102z m330 -130 c0 -22 -170
  -177 -194 -177 -3 0 -6 28 -6 63 l0 62 83 32 c91 35 117 39 117 20z m-321
  -173 c1 -50 -1 -55 -25 -64 -33 -13 -115 -13 -148 0 -20 7 -26 17 -26 38 0 27
  5 31 93 64 50 18 95 30 98 25 4 -5 7 -33 8 -63z'
            />
          </g>
        </svg>
      );
    case "CRE8R":
      return <img src='../assets/images/cre8r-logo.png' alt='CRE8R token' />;
    default:
      return (
        <svg
          version='1.0'
          xmlns='http://www.w3.org/2000/svg'
          width='687.000000pt'
          height='494.000000pt'
          viewBox='0 0 687.000000 494.000000'
          preserveAspectRatio='xMidYMid meet'
          style={{ width: "13px", height: "13px" }}
        >
          <g
            transform='translate(0.000000,494.000000) scale(0.100000,-0.100000)'
            fill='#fff'
            stroke='none'
          >
            <path
              d='M1790 4830 c-327 -24 -575 -122 -639 -253 -15 -31 -21 -63 -21 -113
  l0 -70 -457 -170 c-251 -93 -462 -175 -470 -182 -11 -11 -13 -189 -13 -976 0
  -905 1 -964 18 -979 24 -22 1721 -681 1752 -681 14 1 162 53 329 117 167 65
  310 117 317 117 12 0 65 -36 199 -135 33 -24 85 -61 115 -81 30 -21 78 -56
  105 -79 28 -23 124 -100 215 -170 264 -205 486 -402 765 -676 143 -140 278
  -269 300 -285 61 -47 162 -99 250 -130 75 -26 92 -28 270 -32 210 -4 279 5
  426 59 226 82 433 217 637 413 478 461 804 1138 882 1836 17 147 15 443 -4
  570 -60 417 -225 740 -471 923 -106 79 -216 131 -345 163 -94 23 -119 26 -245
  22 -157 -5 -254 -24 -485 -94 -418 -126 -967 -227 -1362 -250 l-118 -7 0 160
  c0 114 -4 164 -13 177 -7 10 -205 90 -472 191 l-460 173 -5 79 c-9 125 -55
  187 -189 254 -172 86 -505 130 -811 109z m468 -136 c245 -36 412 -124 412
  -217 0 -79 -153 -161 -383 -204 -132 -25 -524 -25 -654 0 -573 109 -483 376
  148 437 120 11 344 4 477 -16z m432 -539 c0 -102 -4 -142 -16 -167 -51 -107
  -296 -192 -591 -205 l-133 -6 0 175 0 175 133 6 c236 11 445 61 557 133 19 13
  38 23 43 23 4 1 7 -60 7 -134z m-1560 -45 c0 -129 3 -156 19 -188 56 -111 213
  -191 466 -238 144 -27 546 -27 690 0 252 47 417 132 466 241 15 33 19 66 19
  188 0 82 4 147 9 145 5 -1 164 -61 355 -133 190 -71 342 -132 338 -136 -10 -8
  -1504 -562 -1517 -562 -18 0 -1549 577 -1539 580 5 2 158 59 339 127 182 69
  336 125 343 125 9 1 12 -35 12 -149z m4778 -201 c378 -86 650 -438 732 -946
  20 -122 28 -325 18 -482 -10 -177 -25 -230 -25 -90 0 129 -10 227 -32 334 -11
  50 -25 117 -31 150 -7 33 -25 98 -40 145 -15 47 -39 122 -54 168 -59 188 -230
  409 -406 526 -90 59 -128 75 -239 98 -78 16 -116 19 -206 13 -125 -7 -300 -41
  -403 -79 -180 -65 -387 -192 -547 -335 l-50 -45 50 53 c274 292 615 479 930
  510 98 9 205 2 303 -20z m-2290 -121 l-3 -103 -115 2 c-128 3 -340 23 -340 32
  0 8 419 169 443 170 16 1 17 -8 15 -101z m1112 -175 c-103 -105 -253 -285
  -357 -429 -174 -241 -327 -547 -428 -854 -54 -165 -68 -226 -85 -366 -17 -135
  -17 -143 -20 -274 -2 -103 -3 -111 -13 -75 -6 24 -11 150 -11 313 l-1 273 -35
  9 c-19 4 -100 25 -180 45 -185 47 -457 137 -630 210 -147 62 -437 207 -566
  282 l-81 48 18 53 c28 81 124 259 182 337 142 191 312 319 497 376 73 22 76
  22 324 10 297 -13 542 -3 836 34 242 31 615 97 629 111 2 2 9 4 15 4 6 0 -36
  -48 -94 -107z m-2025 -76 c-266 -198 -464 -515 -541 -867 -15 -66 -19 -125
  -18 -260 0 -161 3 -182 28 -265 50 -165 132 -286 250 -370 30 -22 56 -42 56
  -45 0 -3 -75 -34 -167 -68 -93 -35 -196 -74 -231 -87 l-62 -24 2 872 3 872
  345 132 c190 72 350 131 355 132 6 0 -3 -10 -20 -22z m1820 -596 l0 -44 -75
  -28 c-119 -46 -110 -47 -110 5 0 59 29 93 90 105 25 5 56 8 70 8 23 -2 25 -6
  25 -46z m257 -151 c15 -30 30 -68 34 -85 5 -29 4 -31 -67 -57 -40 -15 -74 -26
  -75 -25 -3 2 -6 157 -5 185 1 14 59 43 76 39 6 -2 22 -27 37 -57z m-242 -119
  c0 -85 -2 -100 -17 -106 -114 -45 -173 -63 -173 -52 -1 6 -3 51 -6 98 l-6 86
  68 26 c38 15 80 31 94 36 14 5 28 10 33 10 4 1 7 -44 7 -98z m-320 -120 l0
  -100 -56 -21 c-31 -11 -58 -19 -60 -17 -4 4 67 181 87 220 21 38 29 14 29 -82z
  m620 -95 c0 -63 -4 -97 -12 -103 -17 -13 -126 -53 -144 -53 -12 0 -14 18 -12
  97 l3 97 75 27 c41 15 78 28 83 28 4 1 7 -41 7 -93z m-292 -113 l-3 -97 -84
  -33 c-47 -18 -91 -33 -98 -33 -11 0 -13 21 -11 96 l3 97 85 33 c47 18 91 33
  98 33 10 1 12 -22 10 -96z m-326 -35 c2 -7 4 -51 3 -98 l0 -85 -85 -32 c-47
  -18 -91 -32 -99 -33 -11 0 -13 18 -9 90 2 52 9 95 16 102 11 11 144 66 163 67
  4 1 9 -5 11 -11z m2415 -40 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1
  -19z m-1837 -69 c0 -29 -85 -221 -102 -230 -17 -9 -18 -4 -18 94 l0 104 53 21
  c64 24 67 25 67 11z m115 -41 c-10 -64 -41 -175 -71 -259 -38 -106 -102 -199
  -223 -320 -111 -111 -218 -184 -306 -209 -26 -7 -45 -18 -45 -27 0 -22 67
  -178 126 -294 160 -313 385 -557 660 -714 74 -42 84 -45 152 -45 68 0 215 27
  277 50 56 21 34 2 -37 -33 -98 -48 -161 -70 -303 -107 -145 -38 -325 -50 -438
  -30 -361 64 -637 374 -741 830 -34 149 -61 450 -41 450 3 0 25 -10 48 -22 37
  -19 58 -22 167 -22 117 -1 129 1 190 28 100 46 168 93 256 181 130 129 253
  334 306 507 12 43 25 78 26 78 2 0 1 -19 -3 -42z m-365 -146 l0 -98 -90 -33
  c-50 -18 -92 -32 -95 -30 -2 2 -5 47 -7 99 l-3 94 85 33 c47 17 91 32 98 32 9
  1 12 -25 12 -97z m-320 -115 l0 -103 -90 -33 c-50 -18 -93 -32 -95 -30 -6 6
  -9 188 -4 193 4 4 173 72 187 75 1 1 2 -45 2 -102z m330 -130 c0 -22 -170
  -177 -194 -177 -3 0 -6 28 -6 63 l0 62 83 32 c91 35 117 39 117 20z m-321
  -173 c1 -50 -1 -55 -25 -64 -33 -13 -115 -13 -148 0 -20 7 -26 17 -26 38 0 27
  5 31 93 64 50 18 95 30 98 25 4 -5 7 -33 8 -63z'
            />
          </g>
        </svg>
      );
  }
}
