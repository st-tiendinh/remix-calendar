import * as React from 'react';
const SvgEdit = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={33}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M25.691 4.764c-.765 0-1.515.297-2.093.875l-9.907 9.875-.218.219-.063.312-.687 3.5-.313 1.469 1.469-.312 3.5-.688.312-.062.22-.22 9.874-9.905a2.968 2.968 0 0 0-2.094-5.063m0 1.938c.235 0 .465.12.688.343.445.446.445.93 0 1.375l-9.688 9.688-1.718.343.343-1.718 9.688-9.688c.223-.222.453-.343.687-.343m-21 2.03v20h20V15.546l-2 2v9.188h-16v-16h9.188l2-2H4.69"
    />
  </svg>
);
export default SvgEdit;