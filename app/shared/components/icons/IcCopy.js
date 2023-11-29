import * as React from 'react';
const SvgIcCopy = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="#5F6368"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="m4 4 1-1h5.414L14 6.586V14l-1 1H5l-1-1zm9 3-3-3H5v10h8z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M3 1 2 2v10l1 1V2h6.414l-1-1z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIcCopy;
