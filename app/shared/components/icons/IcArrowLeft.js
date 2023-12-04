import * as React from 'react';
const SvgIcArrowLeft = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 48 48"
    {...props}
  >
    <path fill="#fff" fillOpacity={0.01} d="M0 0h48v48H0z" />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M31 36 19 24l12-12"
    />
  </svg>
);
export default SvgIcArrowLeft;
