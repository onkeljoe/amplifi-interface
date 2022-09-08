import React, { useCallback, useState } from "react";
import styled from "styled-components";
import Popover, { PopoverProps } from "../Popover";
import { X } from "react-feather";

const TooltipContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  data: string;
  setShow: (value: boolean) => void;
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
// function DangerousHTML(props: any) {
//   return <div dangerouslySetInnerHTML={{ __html: props.data }}></div>;
// }

export function CampaignTooltip({
  data,
  setShow,
  ...rest
}: CampaignTooltipProps) {
  return (
    <Popover
      content={
        <TooltipContainer>
          <X
            onClick={() => setShow(false)}
            cursor='pointer'
            style={{ alignSelf: "flex-end" }}
          />
          <div dangerouslySetInnerHTML={{ __html: data }}></div>
        </TooltipContainer>
      }
      {...rest}
    />
  );
}
