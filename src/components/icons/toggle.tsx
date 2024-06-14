import type { SVGProps } from "react";
const SvgToggle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M16 4C9.378 4 4 9.378 4 16s5.378 12 12 12 12-5.378 12-12S22.622 4 16 4m0 1c6.081 0 11 4.919 11 11s-4.919 11-11 11S5 22.081 5 16 9.919 5 16 5" />
    <path d="M26.146 4.479 15.943 21.176l-6.125-8.75-1.637 1.148 7 10 1.672-.053 11-18-1.707-1.043z" />
  </svg>
);
export default SvgToggle;
