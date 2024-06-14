import type { SVGProps } from "react";
const SvgCancel = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M22.185 20.451 17.734 16l4.451-4.451-1.734-1.734L16 14.266l-4.451-4.451-1.734 1.734L14.266 16l-4.451 4.451 1.734 1.734L16 17.734l4.451 4.451zM16 3.688c6.821 0 12.313 5.492 12.313 12.313S22.821 28.314 16 28.314 3.687 22.822 3.687 16.001 9.179 3.688 16 3.688" />
  </svg>
);
export default SvgCancel;
