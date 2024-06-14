import type { SVGProps } from "react";
const SvgCheckCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="m13.313 22.688 12-12-1.875-1.938-10.125 10.125-4.75-4.75L6.688 16zm2.687-20c7.375 0 13.313 5.938 13.313 13.313S23.375 29.314 16 29.314 2.687 23.376 2.687 16.001 8.625 2.688 16 2.688" />
  </svg>
);

export default SvgCheckCircle;
