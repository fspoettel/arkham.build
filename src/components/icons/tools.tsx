import type { SVGProps } from "react";
const SvgTools = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M15.2 4v4.803l-3.613 6.822 1.412.75 3-5.666 8.294 15.666 1.413-.75L16.8 8.803V4zm-9.228 7.897-3.128 3.128L16 27.084l4.903-4.494-1.081-1.181L16 24.915 5.156 14.974l.872-.872L16 23.074l3.534-3.181-1.069-1.188-2.466 2.219zm20.056 0-4.003 3.606 1.069 1.188 2.878-2.588.872.872-3.481 3.191 1.081 1.178 4.712-4.319zM8.409 21.625l-2.116 4 1.412.75 2.119-4z" />
  </svg>
);
export default SvgTools;
