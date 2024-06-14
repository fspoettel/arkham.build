import type { SVGProps } from "react";
const SvgTriangle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M15.964.016C7.592.036.733 6.489.069 14.693l-.004.057c-.031.374-.049.81-.049 1.25 0 8.168 6.126 14.904 14.034 15.866l.077.008c.562.07 1.213.11 1.873.11 7.948 0 14.541-5.801 15.776-13.399l.012-.092.196-2.492c0-8.607-6.804-15.626-15.327-15.97L16.626.03a15 15 0 0 0-.625-.012h-.039.002zm.195 7.043 9.268 15.685H6.89z" />
  </svg>
);
export default SvgTriangle;
