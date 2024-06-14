import type { SVGProps } from "react";
const SvgClover = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0m-5.124 5.845a6.6 6.6 0 0 1 5.311 2.673l.013.018a6.6 6.6 0 0 1 4.965-2.249 6.613 6.613 0 0 1 6.613 6.613 6.62 6.62 0 0 1-5.233 6.464l-.043.008c.177.57.28 1.224.28 1.903v.002a6.613 6.613 0 0 1-13.226 0 6.6 6.6 0 0 1 .422-2.316l-.015.046c-3.237-.465-5.697-3.218-5.698-6.546a6.613 6.613 0 0 1 6.613-6.613z" />
  </svg>
);
export default SvgClover;
