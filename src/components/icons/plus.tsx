import type { SVGProps } from "react";
const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M14.933 0v16h2.133V0zm0 16v16h2.133V16zM32 14.933H16v2.133h16zm-16 0H0v2.133h16z" />
  </svg>
);
export default SvgPlus;
