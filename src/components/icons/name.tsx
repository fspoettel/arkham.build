import type { SVGProps } from "react";
const SvgName = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M14.2 4.2v9.6H18v-1.6h-2.2V5.8H18V4.2zm-10 6v15.6h23.6V10.2H20v1.6h6.2v12.4H5.8V11.8H12v-1.6zm4 3.8v7.8H14v-1.6H9.8V14zm7.8 2.2v1.6h8v-1.6zm0 4v1.6h6v-1.6z" />
  </svg>
);
export default SvgName;
