import { Chat } from "@/app/store/chat-store";
import { useEffect, useRef } from "react";

export function useScrollToLastUserMsg(activeChat: Chat | undefined) {
  const msgsDivRef = useRef<HTMLDivElement>(null);
  const outerDivRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isLastMsgFromUser = activeChat?.messages.at(-1)?.role === "user";
    if (!outerDivRef.current || !msgsDivRef.current || !lastUserMsgRef.current)
      return;

    const msgsDivRect = msgsDivRef.current.getBoundingClientRect();
    const outerDivRect = outerDivRef.current.getBoundingClientRect();
    const lastUserMsgRect = lastUserMsgRef.current.getBoundingClientRect();

    msgsDivRef.current.style.minHeight =
      outerDivRect.height + (lastUserMsgRect.top - msgsDivRect.top) - 20 + "px";

    msgsDivRef.current.scrollIntoView({
      behavior: isLastMsgFromUser ? "smooth" : "auto",
      block: "end",
    });
  }, [activeChat?.messages]);


  return {
    msgsDivRef,
    outerDivRef,
    lastUserMsgRef,
  }
}
