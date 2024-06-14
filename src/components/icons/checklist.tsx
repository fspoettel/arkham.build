import type { SVGProps } from "react";
const SvgChecklist = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M16 3.2C8.94 3.2 3.2 8.94 3.2 16S8.94 28.8 16 28.8 28.8 23.06 28.8 16 23.06 3.2 16 3.2m0 1.6c6.195 0 11.2 5.005 11.2 11.2S22.195 27.2 16 27.2 4.8 22.195 4.8 16 9.805 4.8 16 4.8" />
    <path d="M26.319 4.584 15.956 21.54l-6.3-9-1.313.919 7 10 1.337-.044 11-18z" />
  </svg>
);
export default SvgChecklist;
