import type { SVGProps } from "react";
const SvgArrowBack = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M26.688 14.688v2.625h-16.25l7.438 7.5-1.875 1.875L5.313 16 16.001 5.312l1.875 1.875-7.438 7.5h16.25z" />
  </svg>
);
export default SvgArrowBack;
