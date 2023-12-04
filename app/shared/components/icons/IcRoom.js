import * as React from 'react';
const SvgIcRoom = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} {...props}>
    <path
      fill="#5F6368"
      d="M440 424V88h-88V13.005L88 58.522V424H16v32h86.9L352 490.358V120h56v336h88v-32Zm-120 29.642-200-27.586V85.478L320 51Z"
      className="ic-room_svg__ci-primary"
    />
    <path
      fill="#5F6368"
      d="M256 232h32v64h-32z"
      className="ic-room_svg__ci-primary"
    />
  </svg>
);
export default SvgIcRoom;
