import React, { useCallback, useState } from "react";
import styled from "styled-components";
import Popover, { PopoverProps } from "../Popover";
import { InfoBox } from "../campaigns/typesIncentivesKPIs";

const TooltipContainer = styled.div`
  width: 228px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: 400;
  font-size: 12px;
`;

interface TooltipProps extends Omit<PopoverProps, "content"> {
  text: string;
}

interface CampaignTooltipProps extends Omit<PopoverProps, "content"> {
  data: InfoBox;
}

export default function Tooltip({ text, ...rest }: TooltipProps) {
  return (
    <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
  );
}

export function MouseoverTooltip({
  children,
  ...rest
}: Omit<TooltipProps, "show">) {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  );
}

export function CampaignTooltip({ data, ...rest }: CampaignTooltipProps) {
  return (
    <Popover
      content={
        <TooltipContainer>
          {data.startText ? data.startText : null}
          {data.link ? (
            <span color='#FFD6CC'>
              <a href={data.link.url} target='_blank' rel='noreferrer'>
                {data.link.text}
              </a>
            </span>
          ) : null}
        </TooltipContainer>
      }
      {...rest}
    />
  );
}
