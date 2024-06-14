import type { SVGProps } from "react";
const SvgSeal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M16 3.2C8.94 3.2 3.2 8.94 3.2 16S8.94 28.8 16 28.8 28.8 23.06 28.8 16 23.06 3.2 16 3.2m0 1.6c6.195 0 11.2 5.005 11.2 11.2S22.195 27.2 16 27.2 4.8 22.195 4.8 16 9.805 4.8 16 4.8" />
    <path d="M16 6.869 13.669 9.2H9.2v4.469L6.869 16 9.2 18.331V22.8h4.469L16 25.131l2.331-2.331H22.8v-4.469L25.131 16 22.8 13.669V9.2h-4.469zm0 2.262 1.669 1.669H21.2v3.531L22.869 16 21.2 17.669V21.2h-3.531L16 22.869 14.331 21.2H10.8v-3.531L9.131 16l1.669-1.669V10.8h3.531z" />
  </svg>
);
export default SvgSeal;
