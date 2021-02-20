// import interfaces
import { IGraphBarchart, IBarchartRow } from "Interfaces";
// import modules
import React, { useRef, useState, useEffect } from "react";
import classnames from "classnames";

import { trimString } from "utils/utils";

// import d3 visualization
import * as d3 from "d3";

// import styles
import styles from "./styles.module.scss";

const GraphBarchart = React.forwardRef<SVGSVGElement, IGraphBarchart>(
  (props, graphRef) => {
    // set references
    const containerRef = useRef<HTMLDivElement>(null);

    // set the states
    const [width, setWidth] = useState<number | null | undefined>();
    const [height, setHeight] = useState<number | null | undefined>();

    useEffect(() => {
      // update the width and height every 10ms
      const interval = setInterval(() => {
        setWidth(containerRef?.current?.offsetWidth);
        setHeight(containerRef?.current?.offsetHeight);
      }, 200);
      // Remove event listener on cleanup
      return () => clearInterval(interval);
    }, []);

    // create the visualization
    useEffect(() => {
      // chech if we have everything so that we can start creating the graph
      if (!props.data || !containerRef.current || !width || !height) {
        return;
      }

      let color;
      switch (props.color) {
        case "green":
          color = "#10b981";
          break;
        case "blue":
        default:
          color = "#3b82f6";
          break;
      }

      const barHeight = 28;

      const trimLength = getTrimLength(width);

      const data = JSON.parse(JSON.stringify(props.data));
      data.forEach(
        (d: IBarchartRow) => (d.value = trimString(d.value, trimLength))
      );

      const maxLabelLength = Math.max(
        ...data.map((d: IBarchartRow) => d.value.length)
      );

      // prepare static values
      const margin = {
        top: 10,
        left: Math.max(maxLabelLength * 3.5, 30),
        right: 20,
        bottom: 10,
      };

      const svgHeight =
        Math.ceil((data.length + 0.1) * barHeight) + margin.top * 2;

      if (height < svgHeight) {
        margin.right = 30;
      }

      const x = createXScale(width, margin);
      const y = createYScale(data, barHeight, margin);

      // set the graph container
      const svg = updateSVG(containerRef.current, width, svgHeight, margin);
      // update the bars
      const bars = svg.select("g.bars");
      setBars(bars, data, x, y, color);
      // create the bar labels
      const labels = svg.select("g.labels");
      setLabels(labels, data, x, y);
      // update the x- and y-axis
      const xAxis = svg.select("g.xAxis");
      const yAxis = svg.select("g.yAxis");
      xAxis.call(setXAxis(x, width, margin));
      yAxis.call(setYAxis(y, data, margin));
    }, [props.data, props.color, width, height, containerRef]);

    // assign the container style
    const containerStyle = classnames(styles.container, props.className);

    return (
      <div className={containerStyle} ref={containerRef}>
        <svg ref={graphRef}>
          <g className="graph">
            <g className="bars"></g>
            <g className="labels"></g>
            <g className="xAxis"></g>
            <g className="yAxis"></g>
          </g>
        </svg>
      </div>
    );
  }
);

export default GraphBarchart;

// ==============================================
// Graph Helper Functions
// ==============================================

function getTrimLength(width: number) {
  return width < 180
    ? 7
    : width < 240
    ? 12
    : width < 280
    ? 14
    : width < 400
    ? 16
    : 22;
}

function createXScale(width: number, margin: any) {
  return d3
    .scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.left - margin.right]);
}

function createYScale(data: IBarchartRow[], barHeight: number, margin: any) {
  const domain = d3.range(data.length);
  return d3
    .scaleBand()
    .domain(domain.map((val) => val.toString()))
    .range([margin.top, barHeight * data.length + margin.top])
    .padding(0.1);
}

function setXAxis(
  x: d3.ScaleLinear<number, number, never>,
  width: number,
  margin: any,
  duration: number = 500
) {
  return (g: any) => {
    g.transition()
      .duration(duration)
      .call(d3.axisTop(x).ticks(width / 100, "%"))
      .attr("transform", `translate(0, ${margin.top})`)
      .call((g: any) =>
        g
          .selectAll(".tick text")
          .attr("class", styles.axis)
          //* download "style" values
          .style("font-size", "12px")
          .style("font-family", "Lato")
      );
    g.select(".domain").remove();
  };
}

function setYAxis(
  y: d3.ScaleBand<string>,
  data: IBarchartRow[],
  margin: any,
  duration: number = 500
) {
  return (g: any) => {
    g.transition()
      .duration(duration)
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(
        d3
          .axisLeft(y)
          .tickFormat((_d: string, i: number) => data[i].value ?? "N/A")
          .tickSizeOuter(0)
      )
      .call((g: any) =>
        g
          .selectAll(".tick text")
          .attr("class", styles.axis)
          //* download "style" values
          .style("font-size", "12px")
          .style("font-family", "Lato")
      );
    g.select(".domain").remove();
  };
}

function updateSVG(
  div: HTMLDivElement,
  width: number,
  height: number,
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }
) {
  return d3
    .select(div)
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .select("g.graph")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
}

function setBars(
  container: any,
  data: IBarchartRow[],
  x: d3.ScaleLinear<number, number, never>,
  y: d3.ScaleBand<string>,
  color: string,
  duration: number = 500
) {
  //* download "style" values
  container.attr("fill", color);

  // prepare the bars
  const bars = container.selectAll("rect").data(data);

  bars
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", (_d: any, i: number) => y(i.toString()))
    .attr("height", y.bandwidth())
    .transition()
    .duration(duration)
    .attr("width", (d: IBarchartRow) => x(d.precent) - x(0));

  bars
    .transition()
    .duration(duration)
    .attr("x", x(0))
    .attr("y", (_d: any, i: number) => y(i.toString()))
    .attr("width", (d: IBarchartRow) => x(d.precent) - x(0));

  bars.exit().remove();
}

function setLabels(
  container: any,
  data: IBarchartRow[],
  x: d3.ScaleLinear<number, number, never>,
  y: d3.ScaleBand<string>,
  duration: number = 500
) {
  const labels = container.selectAll("text").data(data);

  labels
    .enter()
    .append("text")
    .attr("class", styles.labelLarge)
    //* download "style" values
    .style("font-family", "Lato")
    .style("font-size", "12px")
    .style("text-anchor", "end")
    .style("fill", "white")
    .attr("x", x(0))
    .attr(
      "y",
      (_d: any, i: number) => (y(i.toString()) as number) + y.bandwidth() / 2
    )
    .attr("dy", "0.35em")
    .attr("dx", -4)
    .call((text: any) =>
      text
        .filter((d: IBarchartRow) => x(d.precent) - x(0) < 42) // short bars
        .attr("class", styles.labelSmall)
        //* download "style" values
        .style("text-anchor", "start")
        .style("fill", "black")
        .attr("dx", +4)
    )
    .transition()
    .duration(duration)
    .attr("x", (d: IBarchartRow) => x(d.precent))
    .text((d: IBarchartRow) => d.frequency);

  labels
    .attr("class", styles.labelLarge)
    //* download "style" values
    .style("font-family", "Lato")
    .style("font-size", "12px")
    .style("text-anchor", "end")
    .style("fill", "white")
    .attr("dx", -4)
    .call((text: any) =>
      text
        .filter((d: IBarchartRow) => x(d.precent) - x(0) < 42) // short bars
        .attr("class", styles.labelSmall)
        //* download "style" values
        .style("text-anchor", "start")
        .style("fill", "black")
        .attr("dx", +4)
    )
    .transition()
    .duration(duration)
    .attr("x", (d: IBarchartRow) => x(d.precent))
    .attr(
      "y",
      (_d: any, i: number) => (y(i.toString()) as number) + y.bandwidth() / 2
    )
    .attr("dy", "0.35em")
    .text((d: IBarchartRow) => d.frequency);

  labels.exit().remove();
}