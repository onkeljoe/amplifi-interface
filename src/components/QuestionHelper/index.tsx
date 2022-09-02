import React, { useCallback, useState } from "react";
import { HelpCircle as Question, Info as InfoIcon } from "react-feather";
import styled from "styled-components";
import Tooltip, { CampaignTooltip } from "../Tooltip";
import { InfoBox } from "components/campaigns/typesIncetivesKPIs";

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text2};

  :hover,
  :focus {
    opacity: 0.7;
  }
`;

const LightQuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.white};

  :hover,
  :focus {
    opacity: 0.7;
  }
`;

const QuestionMark = styled.span`
  font-size: 1rem;
`;

export default function QuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show}>
        <QuestionWrapper
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <Question size={16} />
        </QuestionWrapper>
      </Tooltip>
    </span>
  );
}

export function LightQuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show}>
        <LightQuestionWrapper
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <QuestionMark>?</QuestionMark>
        </LightQuestionWrapper>
      </Tooltip>
    </span>
  );
}

// click has to fix the tooltip to be true. help.
export function Info({ data }: { data: InfoBox }) {
  const [show, setShow] = useState<boolean>(false);
  const open = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLDivElement).getAttribute("data-show") === "true") {
        return;
      } else {
        setShow(true);
      }
    },
    [setShow]
  );
  const close = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLDivElement).getAttribute("data-show") === "true") {
        return;
      } else {
        setShow(false);
      }
    },
    [setShow]
  );
  const toggle = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      if (!show) {
        setShow(true);
        target.dataset.show = "true";
      } else {
        setShow(false);
        target.dataset.show = "false";
      }
    },
    [show]
  );
  return (
    <CampaignTooltip data={data} show={show}>
      <InfoIcon
        size={13}
        cursor='help'
        onClick={toggle}
        onMouseEnter={open}
        onMouseLeave={close}
      />
    </CampaignTooltip>
  );
}
