
import * as d3 from "d3";

export class GraphBasic {
    
    margin = {top: 30, right: 20, bottom: 30, left: 50};
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
        var x = d3.scaleTime()
                .range([0, setWidth]);
        var y = d3.scaleLinear()
                .range([setHeight, 0]);

        // Define the axes
        var xAxis = d3.axisBottom(x).ticks(5); // .tickFormat(function(d:any){ return d.x;});
        var yAxis = d3.axisLeft(y).ticks(5);

        // Define the line
        var valueline = d3.line()
                        .x((d: any)=> { return x(d.date); })
                        .y((d: any)=> { return y(d.close); });

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
            });
            
            // Scale the range of the data
            x.domain(<[Date, Date]>d3.extent(data, (d) =>  d.date ));  //  TypeScript is unable to rule out that the first overload matches. add [Date, Date] 
            y.domain([0, d3.max(data, (d)=> d.close )]);
            
            // Add the valueline path.
            svg.append("path")
                .attr("class", "line")
                .attr("d", valueline(data));
            
            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + setHeight + ")")
                .call(xAxis);
            // Add the Y Axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            svg.append("path")
                .datum(data) 
                .attr("class", "area")
                .attr("style", "fill:#E1F5FE; stroke:none")
                .attr("d", area);
                
        });
        
    }

}
