import type { SVGProps } from "react";
const SvgGrid = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M6.2 6.2v8.6h8.6V6.2zm1.6 1.6h5.4v5.4H7.8zM17.2 6.2v8.6h8.6V6.2zm1.6 1.6h5.4v5.4h-5.4zM6.2 17.2v8.6h8.6v-8.6zm1.6 1.6h5.4v5.4H7.8zM17.2 17.2v8.6h8.6v-8.6zm1.6 1.6h5.4v5.4h-5.4z" />
  </svg>
);
export default SvgGrid;
