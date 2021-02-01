const breakpointValues: {
  label: string;
  cols: number;
  breakpoint: number;
  padding: [number, number];
}[] = [
  { label: "2xl", cols: 12, breakpoint: 1530, padding: [16, 16] },
  { label: "xl", cols: 12, breakpoint: 1200, padding: [16, 16] },
  { label: "lg", cols: 12, breakpoint: 1024, padding: [0, 16] },
  { label: "md", cols: 9, breakpoint: 768, padding: [0, 16] },
  { label: "sm", cols: 6, breakpoint: 640, padding: [0, 16] },
  { label: "xs", cols: 4, breakpoint: 480, padding: [0, 16] },
  { label: "xxs", cols: 2, breakpoint: 0, padding: [0, 16] },
];

export const responsivePb: { [key: string]: number } = {};
export const responsiveCp: { [key: string]: [number, number] } = {};
export const responsiveCols: { [key: string]: number } = {};
for (const value of breakpointValues) {
  responsivePb[value.label] = value.breakpoint;
  responsiveCp[value.label] = value.padding;
  responsiveCols[value.label] = value.cols;
}
