import type { SVGProps } from "react";
const SvgRepeat = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M16 7.206a8.77 8.77 0 0 0-6.222 2.572C6.41 13.146 7.227 19.615 11.975 22.2H7v1.6h6.8V17h-1.6v3.425c-3.288-2.294-3.694-7.112-1.291-9.516 2.818-2.819 7.363-2.818 10.181 0s2.819 7.363 0 10.181l1.131 1.131c3.43-3.43 3.43-9.014 0-12.444a8.77 8.77 0 0 0-6.222-2.572z" />
  </svg>
);
export default SvgRepeat;
