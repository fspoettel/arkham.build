import type { SVGProps } from "react";
const SvgOverlap = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M12.6 5.2a2.41 2.41 0 0 0-2.4 2.4V8h1.6v-.4c0-.451.349-.8.8-.8h11.8c.451 0 .8.349.8.8v11.8c0 .451-.349.8-.8.8H24v1.6h.4c1.316 0 2.4-1.084 2.4-2.4V7.6c0-1.316-1.084-2.4-2.4-2.4zm-5 5a2.41 2.41 0 0 0-2.4 2.4v11.8c0 1.316 1.084 2.4 2.4 2.4h11.8c1.316 0 2.4-1.084 2.4-2.4V24h-1.6v.4c0 .451-.349.8-.8.8H7.6a.79.79 0 0 1-.8-.8V12.6c0-.451.349-.8.8-.8H8v-1.6z" />
    <path d="M10.2 10.2v9.2c0 1.316 1.084 2.4 2.4 2.4h9.2v-9.2c0-1.316-1.084-2.4-2.4-2.4zm1.6 1.6h7.6c.451 0 .8.349.8.8v7.6h-7.6a.79.79 0 0 1-.8-.8z" />
  </svg>
);
export default SvgOverlap;
