/**
 * Python like range function
 * code copy/pasted from here: https://stackoverflow.com/a/3746752
 * @param {Number} start
 * @param {Number} end
 * @return {Array} resulting array
*/
function range(start, end) {
    var foo = [];
    for (var i = start; i <= end; i++) {
        foo.push(i);
    }
    return foo;
}

/**
 * Python like fill Array function
 * @param {Number} value to fill Array
 * @param {Nunber} len of the array you want
 * @return {Array} of len with all fields full of value
*/
function fillArray(value, len) {
  let array = new Array(len)
  return array.fill(value)
}

/**
 * Plugin for drawing vertical line, code copy/pasted from here https://stackoverflow.com/a/43092029
 * Allows for lineAtIndex: targets in render_graph
*/
const verticalLinePlugin = {
  getLinePosition: function (chart, pointIndex) {
      const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
      const data = meta.data;
      return data[pointIndex]._model.x;
  },
  renderVerticalLine: function (chartInstance, pointIndex) {
      const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
      const scale = chartInstance.scales['y-axis-0'];
      const context = chartInstance.chart.ctx;

      // render vertical line
      context.beginPath();
      context.strokeStyle = '#ff0000';
      context.moveTo(lineLeftOffset, scale.top);
      context.lineTo(lineLeftOffset, scale.bottom);
      context.stroke();

      // write label
      context.fillStyle = "#ff0000";
      context.textAlign = 'center';
      context.fillText('Ziel überschritten', lineLeftOffset, (scale.bottom - scale.top) / 2 + scale.top);
  },

  afterDatasetsDraw: function (chart, easing) {
      if (chart.config.lineAtIndex) {
          chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
      }
  }
};

Chart.plugins.register(verticalLinePlugin);
