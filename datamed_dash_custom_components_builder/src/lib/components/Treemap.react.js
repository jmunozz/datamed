import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import './treemap.css';



/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
export default function Treemap({ data, width, height }) {
  const svgRef = useRef(null);

  function renderTreemap() {
    const svg = d3.select(svgRef.current);

    svg.attr('width', width).attr('height', height);

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    const treemapRoot = d3.treemap().size([width, height]).padding(1)(root);

    console.log(treemapRoot.leaves())
    
    const nodes = svg
      .selectAll('g')
      .data(treemapRoot.leaves())
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    const fader = (color) => d3.interpolateRgb(color, '#fff')(0.3);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10.map(fader));

    nodes
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => colorScale(d.data.category));
  }

  useEffect(() => {
    renderTreemap();
  }, [data]);

  return (
    <div>
      <svg ref={svgRef} />
    </div>
  );
}

Treemap.defaultProps = {
};

Treemap.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,

    data: PropTypes.any,

    width: PropTypes.number,

    height: PropTypes.number

};
