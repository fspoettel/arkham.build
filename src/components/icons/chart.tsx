import type { SVGProps } from "react";
const SvgChart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M12.2 4.2V8h1.6V5.8h4.4v16.4H14v1.6h5.8V4.2zm-8 6v13.6h7.6V10.2zm1.6 1.6h4.4v10.4H5.8zM22 16.2v1.6h4.2v4.4H22v1.6h5.8v-7.6zm-15 10v1.6h4v-1.6zm8 0v1.6h4v-1.6zm8 0v1.6h4v-1.6z" />
  </svg>
);
export default SvgChart;
