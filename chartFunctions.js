function query_function(jsonData, AlaSqlQuery, chartDivId, xAxisLabel, yAxisLabel) {

    //Running the AlaSqlQuery as a promise so that D3.js graph starts rendering only after the query is completed.
    alasql.promise(AlaSqlQuery, [jsonData])
        .then(function (data) {
            console.log(data);
            // D3.js function which takes in JSON input and plots a graph.
            renderBarChart(data, chartDivId, xAxisLabel, yAxisLabel); 
        }).catch(function (err) {
            console.log('Error:', err);
        });
};

function renderBarChart(data, chartDivId, xAxisLabel, yAxisLabel) {

    var formatDate = d3.time.format("%d-%b-%y");
    
    // Format the data
    data.forEach(function (d) {
        d.date = formatDate.parse(d.date);
        d.sample_size = isNaN(d.sample_size) ? 0 : d.sample_size;
        return d;
    });

    // Set the dimensions of the canvas / graph
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .7);

    var y = d3.scale.linear()
        .range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x).tickFormat(d3.time.format("%d-%m-%y"))
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // Adds the svg canvas to the chartDivId
    var svg = d3.select(chartDivId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain(data.map(function (d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.sample_size;
    })]);

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", 10)
        .attr("y", 20)
        .attr("dx", ".71em")
        .style("text-anchor", "end")
        .text(xAxisLabel);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yAxisLabel);

    // Add the bars to the graph
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.date);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.sample_size);
        })
        .attr("height", function (d) {
            return height - y(d.sample_size);
        });

}