import type { SVGProps } from "react";
const SvgPoiLocked = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M16 0C7.191 0 0 7.191 0 16s7.191 16 16 16 16-7.191 16-16S24.809 0 16 0m0 4.571c6.339 0 11.429 5.09 11.429 11.429S22.339 27.429 16 27.429 4.571 22.339 4.571 16 9.661 4.571 16 4.571" />
    <path d="M22.857 16a6.857 6.857 0 1 1-13.714 0 6.857 6.857 0 0 1 13.714 0" />
  </svg>
);
export default SvgPoiLocked;
