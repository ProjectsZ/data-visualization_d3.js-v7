
import * as d3 from "d3";

export class GraphBasic {
    
    margin = {top: 30, right: 50, bottom: 30, left: 30};
    width: number = window.innerWidth * 0.9;
    height: number = 270;

    constructor(){
    }

    smoothingCurveBasic(){
                // Set the dimensions of the canvas / graph
        let setWidth: number = 
        this.width - this.margin.left - this.margin.right;
        let setHeight: number = 
        this.height - this.margin.top - this.margin.bottom;

        // Parse the date / time
        var parseDate = d3.timeParse("%d-%b-%y"); // ("%Y-%m-%d")

        // Set the ranges
        let x = d3.scaleTime()
                .range([1, setWidth]);
        var y = d3.scaleLinear()
                .range([setHeight, 0]);
        var y1 = d3.scaleLinear()
                .range([setHeight, 0]);

        // Define the axes
        var xAxis = d3.axisBottom(x).ticks(5); // .tickFormat(function(d:any){ return d.x;});
        var yAxisLeft = d3.axisLeft(y).ticks(5);
        var yAxisRight = d3.axisRight(y1).ticks(5);
        // Define the line
        let valueLine1 = d3.line()
                        .x((d: any)=> { return x(d.date); })
                        .y((d: any)=> { return y(d.close); }); // <== y
        
        let valueLine2 = d3.line()
                        .x((d: any)=> { return x(d.date); })
                        .y((d: any)=> { return y1(d.open); }); // <== y1

        // Define the area
        var area = d3.area()
                    .x((d: any)=> x(d.date))
                    .y0(setHeight) // (0)
                    .y1((d: any)=>y(d.close));

        // Adds the svg canvas
        var svg = 
         d3.select("#smothing-curve")
          .append("svg")
          .attr("width", 
                setWidth + this.margin.left + this.margin.right)
          .attr("height", 
                setHeight + this.margin.top + this.margin.bottom)
          .append("g")
          .attr("transform", 
                "translate(" + 
                  this.margin.left + "," + this.margin.top + ")");

        // Get the data
        d3.csv("./src/smoothing-curve/data.csv")
          .then((data: any[])=> {
            data.forEach((d: any)=> {
                d.date = parseDate(d.date);
                d.close = +d.close;
                d.open = +d.open;
            });
            
            // Scale the range of the data
            x.domain(<[Date, Date]>d3.extent(data, (d) =>  d.date ));  //  TypeScript is unable to rule out that the first overload matches. add [Date, Date] 
            y.domain([0,
                    <number>d3.max(data, (d)=> Math.max(d.close) )]);
            y1.domain([0,
                    <number>d3.max(data, (d)=> Math.max(d.open) )]);

            // Add the valueline path.
            svg.append("path")
                .attr("class", "line").style("stroke-dasharray", ("5, 3")) // <== ("stroke-dasharray", sizeStroke, spaceBetweenStroke)
                .attr("d", valueLine1(data));
            
            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + setHeight + ")")
                .call(xAxis);
            // Add the Y Axis
            svg.append("g")
                .attr("class", "y axis")     
                .call(yAxisLeft);
            svg.append("g")
                .attr("class", "y1 axis")
                .attr("transform", `translate(${ setWidth } ,0)`)
                .call(yAxisRight);
            
            // draw the area
            svg.append("path")
                .datum(data) 
                .attr("class", "area")
                .attr("style", "fill:#E1F5FE; stroke:none")
                .attr("d", area);
            
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", `translate(0, ${ setHeight } )`)
                .call( this.makeXaxis(x, 5)
                        .tickSize(-setHeight)
                        .tickFormat((d)=> "") )
            
            svg.append("g")
                .attr("class", "grid")
                .call( this.makeYaxis(y, 5)
                        .tickSize(-setWidth)
                        .tickFormat((d)=> ""))

            svg.append("path") // Add the valueline2 path.
               .style("stroke", "#F44336")
               .attr("d", valueLine2(data));

            svg.append("text")
               .attr("transform", 
                     "translate("+(setWidth-1)+","+y(data[0].close)+")")
               .attr("dy", ".15em")
               .attr("text-anchor", "start")
               .style("fill", "#42A5F5") // @blue_400
               .text("Close");

            svg.append("text")
               .attr("transform", 
                     "translate("+(setWidth-1)+","+y(data[0].open)+")")
               .attr("dy", "-.25em")
               .attr("text-anchor", "start")
               .style("fill", "#F44336") // @red_500
               .text("Open");
        });
        
    }

    makeXaxis(x: any, countTicks: number) {
       return d3.axisBottom(x).ticks(countTicks);
    }

    makeYaxis(y: any, countTicks: number) {
        return d3.axisLeft(y).ticks(countTicks);
    }

}
