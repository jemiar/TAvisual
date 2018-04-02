d3.queue()
	.defer(d3.csv, "https://raw.githubusercontent.com/jemiar/TAvisual/master/fall17data.csv", type)
	.defer(d3.csv, "https://raw.githubusercontent.com/jemiar/TAvisual/master/spring18data.csv", type)
	.await(drawChart);

function drawChart(error, fall17data, spring18data) {
	if(error) { console.log(error); }

	var fall17ByClass = d3.nest().
		key(function(d) { return d.classID; }).
	    key(function(d) { return d.week; }).
	    rollup(function(v) { return {
	    	week: v[0].week,
	    	total: d3.sum(v, function(d) {return d.labtime + d.classtime + d.grading + d.officehr + d.classprep + d.other; })
	    	};
	    }).
	    entries(fall17data);

	var spring18ByClass = d3.nest().
    	key(function(d) { return d.classID; }).
    	key(function(d) { return d.week; }).
    	rollup(function(v) { return {
      		week: v[0].week,
      		total: d3.sum(v, function(d) {return d.labtime + d.classtime + d.grading + d.officehr + d.classprep + d.other; })
      		};
    	}).
    	entries(spring18data);

  	console.log(fall17ByClass);
  	console.log(spring18ByClass);
}

function type(d) {
  	d.labtime = +d.labtime;
  	d.classtime = +d.classtime;
  	d.grading = +d.grading;
  	d.officehr = +d.officehr;
  	d.classprep = +d.classprep;
  	d.other = +d.other;
  	d.week = +d.week;
  	return d;
}