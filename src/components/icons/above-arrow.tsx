import type { SVGProps } from "react";
const SvgAboveArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="m15.434 8.434-5 5 1.131 1.131 3.634-3.634V21.8h11.8v-1.6h-10.2v-9.269l3.634 3.634 1.131-1.131-5-5-.566.566z" />
  </svg>
);
export default SvgAboveArrow;
