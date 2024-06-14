import type { SVGProps } from "react";
const SvgInfo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M16 8.534c-.985 0-1.8.815-1.8 1.8s.815 1.8 1.8 1.8 1.8-.815 1.8-1.8-.815-1.8-1.8-1.8m0 1.6c.12 0 .2.08.2.2s-.08.2-.2.2-.2-.08-.2-.2.08-.2.2-.2M14 13.7v1.6h1.7v7.4H14v1.6h4.5v-1.6h-1.2v-9z" />
  </svg>
);
export default SvgInfo;
