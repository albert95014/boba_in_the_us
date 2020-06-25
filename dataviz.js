$(document).ready(function() {
	$(".test").click(function() {
		alert("hello!");


	}); 

	d3.csv("boba_ratings.csv", function(d, i, columns) {
		// var keys = ["<3.0", "3.0", "3.5", "4.0", "4.5", "5.0"];
		for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
		  d.total = t;
		  return d;
		}, function(error, data) {
  		if (error) throw error;
		var keys = data.columns.slice(1);


	var svg = d3.select(".allCitiesViz"),
	    margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = +svg.attr("width") - margin.left - margin.right,
	    height = +svg.attr("height") - margin.top - margin.bottom,
	    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Set x, y and colors
		var x = d3.scaleBand()
		    .rangeRound([0, width])
		    .paddingInner(0.15)
		    .align(0.1);

		var y = d3.scaleLinear()
		    .rangeRound([height, 0]);

		var z = d3.scaleOrdinal()
		    .range(["#FFD6CC", "#FFB6A5", "#FF967E", "#FF7656", "#FF562F", "#FF3608"]);


		data.sort(function(a, b) { return b.total - a.total; });
			x.domain(data.map(function(d) { return d.city; }));
			y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
			z.domain(keys);

		    g.append("g")
			    .selectAll("g")
			    .data(d3.stack().keys(keys)(data))
			    .enter().append("g")
			      .attr("fill", function(d) {return z(d.key); })
			    .selectAll("rect")
			    .data(function(d,i) { return d; })
			    .enter().append("rect")
			      .attr("class", "rect")
			      .attr("x", function(d) { return x(d.data.city); })
			      .attr("y", function(d) { return y(d[1]); })
			      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
			      .attr("width", x.bandwidth())
			    .on("mouseover", function() { tooltip.style("display", null); })
				.on("mouseout", function() { tooltip.style("display", "none"); })
				.on("mousemove", function(d,i) {
					// console.log(d.data["3.0-rating"]); 
					var thisName = d3.select(this.parentNode).datum().key;
					var ratingText;
					var xPosition = d3.mouse(this)[0] + 35;
					var yPosition = d3.mouse(this)[1] - 35;
					tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
					tooltip.select("text")
						.text(d.data.city + " has " + (d[1]-d[0]) + " boba businesses with a " + thisName + " on Yelp")
						
						.call(wrap, 270)

				 
					// console.log(tooltip.text());
				});

				g.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(0," + height + ")")
					.call(d3.axisBottom(x));

				g.append("g")
					.attr("class", "axis")
					.call(d3.axisLeft(y).ticks(10, "s"))
				 .append("text")
					.attr("x", 2)
					.attr("y", y(y.ticks().pop()) + 0.5)
					.attr("dy", "0.32em")
					.attr("fill", "#000")
					.attr("font-weight", "bold")
					.attr("text-anchor", "start");

			// Prep the tooltip bits, initial display is hidden
			var tooltip = svg.append("g")
			    .attr("class", "tooltip")
			    .style("display", "none");
			      
				// tooltip.append("rect")
			 //    .attr("width", 60)
			 //    .attr("height", 20)
			 //    .attr("fill", "white")
			 //    .style("opacity", 0.5);

				tooltip.append("text")
			    .attr("x", 30)
			    .attr("dy", "1.1em")
			    .style("text-anchor", "middle")
			    .attr("font-size", "0.9rem")
			    .attr("font-weight", "bold");

			var legend = g.append("g")
				.attr("font-family", "sans-serif")
				.attr("font-size", "0.9rem")
				.attr("text-anchor", "end")
				.selectAll("g")
				.data(keys.slice().reverse())
				.enter().append("g")
				.attr("transform", function(d, i) { return "translate(0," + i *  30+ ")"; });

			legend.append("rect")
				.attr("x", width - 25)
				.attr("width", 25)
				.attr("height", 25)
				.attr("fill", z);

			legend.append("text")
				.attr("x", width - 30)
				.attr("y", 12)
				.attr("dy", "0.32em")
				.text(function(d) { return d; });


		// var ratingsByCity = d3.nest()
		// 	.key(function(d) { return d["businesses__location__city__cleaned"] })
		// 	.key(function(d) { return d["businesses__rating"] })
		// 	.entries(data);

		// console.log(ratingsByCity);
  /////////

		// var valuesByCity;

		// data.forEach(function(d){
		// 	//group and organize your data as needed here
		// valuesByCity = d3.nest()
		// 	//set the decade as your key
		// 	.key(function(d) {return d["businesses__location__city__cleaned"]}) 
		// 	.entries(data);
		// });

		// console.log(valuesByCity[3])

		// var cityRatingValues = [];

		// for (var i=0; i<valuesByCity.length; i++) {
		// 	valuesByCity.forEach(function(d){
		// 		//group and organize your data as needed here
		// 	cityRatingValues[i] = d3.nest()
		// 		//set the decade as your key
		// 		.key(function(d) {return d["businesses__rating"]}) 
		// 		.entries(data);
		// 	});
		// }


		// var layers = d3.stack()(["businesses__rating", "businesses__review_count"].map(function(rating){
		// 	return data.map(function(d){
		// 		return {x: d.businesses__location__city__cleaned, y: +d[rating]}
		// 	})
		// }))


		// var button = d3.select("body").append("button");
		// 	button.text("Run!");
		// 	button.on("click", execute);


	});



var filteredData

function individualCitiesViz (selectedCity) {
    d3.csv("boba.csv", function(data) {

    	var ratings = [];

    	for (var i=0; i<data.length; i++) {
    		ratings.push(data[i].businesses__rating);
    		
    		// console.log(data[i].businesses__location__city);
    	}

    	function filterByCity(selectedCity) {
    		filteredData = data.filter(function(d,i) { return d.businesses__location__city__cleaned == selectedCity;});
    	}

    	filterByCity(selectedCity);
    	// console.log(selectedCity);

    	var bostonData = data.filter(function(d, i) { return d.businesses__location__city__cleaned == "Boston";});
    	var chicagoData = data.filter(function(d, i) { return d.businesses__location__city__cleaned == "Chicago";});
    	var losAngelesData = data.filter(function(d, i) { return d.businesses__location__city__cleaned == "Los Angeles";;});
    	var newYorkData = data.filter(function(d, i) { return d.businesses__location__city__cleaned == "New York";});
    	var philadelphiaData = data.filter(function(d, i) { return d.businesses__location__city__cleaned == "Philadelphia";});
    	var sanJoseData = data.filter(function(d, i) { return d.businesses__location__city__cleaned == "San Jose";});
    	var sanFranciscoData = data.filter(function(d, i) { return d.businesses__location__city__cleaned == "San Francisco";});
    	var seattleData = data.filter(function(d, i) { return d.businesses__location__city__cleaned == "Seattle";});

    	var alldata = [bostonData, chicagoData, losAngelesData, newYorkData, philadelphiaData, sanJoseData, sanFranciscoData, sanFranciscoData, seattleData];

    	var ratingsByCity = d3.nest()
			.key(function(d) { if (d["businesses__rating"] < 3)
								return 2.5;
							else 
								return d["businesses__rating"] })
			.entries(filteredData);

		//set var keys to be filled with different ratings
		var keys = [];
		for (var i=0; i<ratingsByCity.length; i++) {
			keys.push(ratingsByCity[i].key);
		}

		//sort ratingsByCity keys to be in order
		ratingsByCity.sort(function(a, b) { 
			return a.key - b.key  ||  a.name.localeCompare(b.name);
		});

		var containedInRatings = function(ratings, r) {
			found = false;
			ratings.forEach(function(item, index) {
				console.log(item['key'], r, Math.abs(item['key'] - r))
				if ( Math.abs(item['key'] - r) < 0.1) {
					found = item;
				}
			});
			return found;
		}

		var completeRatings = function(ratings) {
			newRatings = [];
			['2.5', '3.0', '3.5', '4.0', '4.5', '5.0'].forEach(function(r, index) {
				item = containedInRatings(ratings, r);
				if ( ! item ) {
					newRatings.push({
						'key': r, 
						'values': []
					});
				} else {
					newRatings.push(item);
				}
			})
			return newRatings;
		}

		ratingsByCity = completeRatings(ratingsByCity);

		keys.sort(function(a, b){return a - b});

		// console.log(sanJoseData);
//removed, but may need for nesting attempt below
		// var x = d3.scaleBand()
		// 	    .rangeRound([0, width])
		// 	    .paddingInner(0.15)
		// 	    .align(0.2);
		// var y = d3.scaleLinear().rangeRound([height, 0]);

		// ratingsByCity.sort(function(a, b) { return b.total - a.total; });
		// x.domain(ratingsByCity.map(function(d) { return d.key; }));
		// y.domain([0, d3.max(ratingsByCity, function(d) { for (var i=0; i<d.values.length; ++i) return d.values.length; })]);

		var svg = d3.select(".individualCitiesViz"),
		    margin = {top: 20, right: 20, bottom: 30, left: 20},
		    width = +svg.attr("width") - margin.left - margin.right,
		    height = +svg.attr("height") - margin.top - margin.bottom;

		var x = d3.scaleBand().rangeRound([0, width]), //normally has .padding(0.02)
		    y = d3.scaleLinear().rangeRound([height, 0]),
		    z = d3.scaleOrdinal().range(["#FFD6CC", "#FFB6A5", "#FF967E", "#FF7656", "#FF562F", "#FF3608"]);

		// console.log(x.step());
		// console.log(x.bandwidth()/keys.length);
		//step = width-40(40 being the total defined margins);

		var bars = svg.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		  x.domain([">3-rating", "3.0-rating", "3.5-rating", "4.0-rating", "4.5-rating", "5.0-rating"]);
		  y.domain([0, d3.max(ratingsByCity, function(d) {
		  	// console.log(d.values.length); 
		  	return d.values.length; 
		  })]);
		  z.domain(keys);

		  bars.append("g")
		      .attr("class", "axis axis--x")
		      .attr("transform", "translate(0," + height + ")")
		      .call(d3.axisBottom(x));

		      // text label for the x axis
		  // bars.append("text")             
		  //     .attr("transform",
		  //           "translate(" + (width/2) + " ," + 
		  //                          (height + margin.top + 40) + ")")
		  //     .style("text-anchor", "middle")
		  //     .text("Yelp Rating");

		  // bars.append("g")
		  //     .attr("class", "axis axis--y")
		  //     .call(d3.axisLeft(y).ticks(3, "s"))
		  //   .append("text")
		  //     .attr("transform", "rotate(-90)")
		  //     .attr("y", 6)
		  //     .attr("dy", "0.71em")
		  //     .attr("text-anchor", "end")
		  //     .text("Frequency");

		var counter = 0; 
		var lastBusinessIndex = -1;

		var groups = bars.selectAll(".bar")
		    .data(ratingsByCity)
		    .enter().append("g") //should append rect
				// .attr("class", "bar")
				.attr("x", function(d,i) { return x(d.key); })
				// .attr("y", function(d) { return y(d.values.length); })
				.attr("y", function(d,i) { return y(d.values.length); })
				.attr("width", x.bandwidth())
				.attr("height", function(d) { return height - y(d.values.length); })
				.attr("transform", function(d,i) { 
					counter=0;
					// console.log('hello: ', x);
					// console.log('bandwidth: ', x.bandwidth());
					// console.log('d,i: ', d, i);
					return "translate(" + (((x.bandwidth())*(i))+45) + "," + 10 + ")" //lmaoooo
				})
				// .style("fill", "lightblue");


		var circles = groups.selectAll(".bar")
			.data(function(d){  return d.values })
			.enter().append("circle")
				.attr("class", "bar")
				// .transition() //super extra transition
		  //           .duration(1000)

				.attr("cx", function(d,i) { return 35*(i%4); })
				.attr("cy", function(d,i) { 
											var new_brating = d.businesses__rating;
											if (new_brating < 3)
												new_brating = 3;

											// var currentBusinessIndex = keys.indexOf(d.businesses__rating);
											var currentBusinessIndex = keys.indexOf(new_brating);

											if(lastBusinessIndex != currentBusinessIndex) {
												lastBusinessIndex = currentBusinessIndex;
												counter = 0;
											}

											if (i%4 == 0) { 
												counter++;
												// console.log(keys.indexOf(new_brating));
												// console.log(counter);
												return height-(35*counter);

											} else {
												return height-(35*counter);
											};
										   })
				.attr("r", 10)
				.attr("fill", function(d) { var new_brating = d.businesses__rating;
											if (new_brating < 3)
												new_brating = 3;

											// console.log(z(d.businesses__rating)); 
											return z(new_brating); })
			.on("mouseover", function() { tooltip.style("display", null); })
			.on("mouseout", function() { tooltip.style("display", "none"); })
			.on("mousemove", function(d) {
				var xPosition = d3.mouse(groups.node())[0] - 5;
				var yPosition = d3.mouse(this)[1] - 5;
				tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
				tooltip.select("text")
					.html(d.businesses__name + " &mdash; " + d.businesses__review_count + " reviews")
					.call(wrap, x.rangeBand())
			})
			.on("click", function(d){window.open("https://www.yelp.com/biz/" + d.businesses__alias, "_blank");});

			var tooltip = svg.append("g")
			    .attr("class", "tooltip")
			    .style("display", "none");
			      
				tooltip.append("rect")
			    // .attr("width", "auto")
			    // .attr("height", "auto")
			    .attr("fill", "white")
			    .style("opacity", 0.5);

				tooltip.append("text")
				.attr("data-html", "true")
			    .attr("x", 30)
			    .attr("dy", "1.1em")
			    .style("text-anchor", "middle")
			    .attr("font-size", "0.9rem")
			    .attr("font-weight", "bold");



		// var svg = d3.select(".individualCitiesViz"),
		//     margin = {top: 20, right: 20, bottom: 30, left: 40},
		//     width = +svg.attr("width") - margin.left - margin.right,
		//     height = +svg.attr("height") - margin.top - margin.bottom,
		//     g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");




//NON NESTED SELECTION ATTEMPT (DATA HAS 6 OBJ)
		// var circle = svg.selectAll("circle")
		// 	.data(ratingsByCity);

		// 	circle.enter().append("circle")
		// 		.attr("cx", function(d,i) { for (var j=0; j<d.values.length; j++)
		// 										return j*30 + 100
		// 									})
		// 		.attr("cy", function(d,i) { for (var j=0; j<d.values.length; j++);
		// 										return j*30 + 100
		// 									})
		// 		.attr("r", function(d,i) { console.log(d.values.length); return 15})
		// 		.style("fill", "green")
		// 		.style("opacity", 0.5);

		// console.log(ratingsByCity[1].values);

//NESTED SELECTION ATTEMPT (creates janked up version that could potentially work)
		// var groups = svg.selectAll(".circle") // start a nested selection
		// 	.data(ratingsByCity)
		// 	.enter().append("g")
		// 	.attr("class", "circle");


		// var circle = groups.selectAll("circle")
		// 	.data(function(d) { console.log(keys.indexOf(d.key)); return d.values }); // tell d3 where the children are
		// 	circle.enter().append("circle")
		// 		.attr("cx", function(d,i) { console.log(d.businesses__rating);
		// 									return ((i%3)*60)+((keys.indexOf(d.businesses__rating))*250)+60 })
		// 		.attr("cy", function(d,i) { 
		// 										return i*30 
		// 								  })
		// 		.attr("r", function(d,i) { console.log(); return 30})

		// 		.style("fill", "green")
		// 		.style("opacity", 0.1);

		// console.log(ratingsByCity[1].values);

//CODE TO CHANGE ratingsByCity THING
		// var button = d3.select("body").append("button");
		//   button.text("Run!");
		//   button.on("click", execute);

		//   function execute() {
		//   	bostonData = [1, 2, 3];
		//   	ratingsByCity = d3.nest()
		// 	.key(function(d) { return d["businesses__rating"] })
		// 	.entries(bostonData);
		//   	console.log(ratingsByCity);

		//   }
	});
}

individualCitiesViz("New York");

// handle on click event
d3.select('#citiesList')
  .on('change', function() {
  	d3.selectAll(".individualCitiesViz > *").remove();
    var newData = eval(d3.select(this).property('value'));
    individualCitiesViz(newData);
});

		// allCitiesViz.selectAll("rect")
		// 	.data(alldata)
		// 	.enter().append("rect")
		// 		.attr("height", function(d, i) { 
		// 			return d.length; 
		// 		})
		// 		.attr("width", 30)
		// 		.attr("x", function(d, i) { 
		// 			return (40*i); 
		// 		})
		// 		.attr("y", 10)
		// 		.attr("fill", "green")
		// 		// .text(function(d, i) { return d[i].length});

		// var execute = function() {
		// 	console.log("clicked!")
			
		// 	allCitiesViz.selectAll("rect")
		// 		.transition().duration(3000) //animation - 3 seconds long
		// 		.attr("height", function(d, i) { 
		// 			return d.length; 
		// 		})
		// 		.attr("width", 30)
		// 		.attr("x", function(d, i) { 
		// 			return (80*i); 
		// 		})
		// 		.attr("y", 10)
		// 		.attr("fill", "blue");
		// }
//word wrapping for text elements
	function wrap(text, width) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 0.3, // ems
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
	      }
	    }
	  });
	}





});

//data[x]
//0-45 = Boston
//46-73 = Chicago
//74-138 = Los Angeles
//139-350 = New York
//351-383 = Philadelphia
//384-483 = San Jose
//484-572 = San Francisco
//573-608 = Seattle

/* d3 examples
	d3.selectAll("p")
	  .data([4, 8, 15, 16, 23, 42])
	    .style("font-size", function(d) { return d + "px"; });


	d3.select("body")
		.selectAll("p")
			.data([4, 8, 15, 16, 23, 42])
			.enter().append("p")
			.text(function(d) { return "I’m number " + d + "!"; });
*/

// var p = d3.selectAll("p");
// p.style("color", "green");
// p.append("span").text("New text in a span element.");

// var execute = function() {
//   var svg = d3.select("svg"); //sets initial place so it knows where to look; without this, enter().append gets confused
//   var p = svg.selectAll("rect")
//     .data([127, 61, 256, 71]); //randomly hard-coded data

//   p.transition().duration(3000) //animation - 3 seconds long
//    .attr("x", 0)
//    .attr("y", function(d, i) {//d -> data, i -> index
//       return i*50; //iterates through each rectangle(index)
    
//   })
//    .attr("width", function(d, i) {
//       return d; //.data binds data to this selection
    
//   })
//    .attr("height", 20)
//    .style("fill", "steelblue");
  
//   p.enter().append("rect")
//    .attr("x", 10)
//    .attr("y", 10)
//    .attr("width", 30)
//    .attr("height", 30)
//    .style("fill", "green");
// }

// var button = d3.select("body").append("button");
//   button.text("Run!");
//   button.on("click", execute);

