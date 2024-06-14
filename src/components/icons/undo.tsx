import type { SVGProps } from "react";
const SvgUndo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M18 9.506c-1.938 0-3.903.686-5.378 2.156S10.2 15.368 10.2 18.306v1.866l-2.656-2.453-1.088 1.178 4 3.691.544-.587.544.587 4-3.691-1.088-1.178-2.656 2.453v-1.866c0-2.601.804-4.364 1.953-5.509s2.684-1.691 4.247-1.691 3.097.545 4.247 1.691 1.953 2.909 1.953 5.509h1.6c0-2.938-.946-5.171-2.422-6.641S19.937 9.506 18 9.506" />
  </svg>
);
export default SvgUndo;
