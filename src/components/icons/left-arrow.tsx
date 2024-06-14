import type { SVGProps } from "react";
const SvgLeftArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M19.434 5.434 8.868 16l10.566 10.566 1.131-1.131-9.434-9.434 9.434-9.434-1.131-1.131z" />
  </svg>
);
export default SvgLeftArrow;
