import type { SVGProps } from "react";
const SvgTrash = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M13 2.2v1.6h6V2.2zm-7 4v1.6h20V6.2zm2.8 3.753-1.6.094L8.247 27.8h15.506L24.8 10.047l-1.6-.094-.953 16.247H9.753zm4 .013-1.6.069.5 12 1.6-.069zm6.4 0-.5 12 1.6.069.5-12zm-4 .034v12h1.6V10z" />
  </svg>
);
export default SvgTrash;
