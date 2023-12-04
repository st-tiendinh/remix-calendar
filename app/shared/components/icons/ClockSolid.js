import * as React from 'react';
const SvgClockSolid = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M12.309 3.267c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.038-9-9-9Zm0 1.5c4.151 0 7.5 3.349 7.5 7.5 0 4.152-3.349 7.5-7.5 7.5a7.488 7.488 0 0 1-7.5-7.5c0-4.151 3.348-7.5 7.5-7.5m-.75 1.5v6.75h5.25v-1.5h-3.75v-5.25h-1.5"
    />
  </svg>
);
export default SvgClockSolid;
