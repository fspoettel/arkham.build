import type { SVGProps } from "react";
const SvgBelowArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M9.2 6v15.8h12.869l-3.634 3.634 1.131 1.131 5-5-.566-.566.566-.566-5-5-1.131 1.131 3.634 3.634H10.8v-14.2z" />
  </svg>
);
export default SvgBelowArrow;
