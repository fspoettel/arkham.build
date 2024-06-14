import type { SVGProps } from "react";
const SvgFontSize = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M6.2 6.2V12h1.6V7.8h6.4v16.4H10v1.6h10v-1.6h-4.2V7.8h6.4V12h1.6V6.2H15zm11.8 10v1.6h4.2V26h1.6v-8.2H28v-1.6h-5z" />
  </svg>
);
export default SvgFontSize;
