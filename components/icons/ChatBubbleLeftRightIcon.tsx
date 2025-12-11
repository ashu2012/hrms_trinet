
import React from 'react';

const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.355 0-2.697-.056-4.024-.166-.37-.03-.733-.064-1.092-.102a9.712 9.712 0 0 1-3.236-3.236c-.254-.46-.46-.94-.606-1.442a9.713 9.713 0 0 1-1.602-3.876c-.07-.463-.1-.933-.088-1.405l.088-.057c.712-.46 1.48-.84 2.29-1.125A9.761 9.761 0 0 1 12 5.25c1.47 0 2.87.322 4.145.908a9.742 9.742 0 0 1 4.105 2.353ZM12 4.5a10.51 10.51 0 0 1 9 4.887 10.536 10.536 0 0 0-4.5-2.25 9.034 9.034 0 0 0-9 0 10.536 10.536 0 0 0-4.5 2.25A10.51 10.51 0 0 1 12 4.5Z" />
  </svg>
);

export default ChatBubbleLeftRightIcon;