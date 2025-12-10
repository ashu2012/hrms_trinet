import React from 'react';

const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.57-1.023 1.535-1.854 2.753-2.31M12.75 21a3 3 0 0 0-2.22-2.872M12.75 21V15M12.75 15A6 6 0 1 0 12.75 3a6 6 0 0 0 0 12Zm-9.75 6.375a3 3 0 0 1-3-3V12.75a3 3 0 0 1 3-3h1.5a3 3 0 0 1 3 3v.375m-6 6.375a3 3 0 0 0-3-3V12.75a3 3 0 0 0 3-3h1.5a3 3 0 0 0 3 3v.375"
    />
  </svg>
);

export default UserGroupIcon;
