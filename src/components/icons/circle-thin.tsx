import type { SVGProps } from "react";
const SvgCircleThin = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M16 0C7.17 0 0 7.17 0 16s7.17 16 16 16 16-7.17 16-16S24.83 0 16 0m0 1.067c8.254 0 14.933 6.68 14.933 14.933S24.253 30.933 16 30.933 1.067 24.253 1.067 16 7.747 1.067 16 1.067" />
  </svg>
);
export default SvgCircleThin;
