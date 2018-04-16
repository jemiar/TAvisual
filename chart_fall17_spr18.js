var weekNo = [
	1, 2, 3, 4,
	5, 6, 7, 8,
	9, 10, 11, 12,
	13, 14, 15, 16, 17
];

var chartF17 = d3.select(".chartFall17"),
	chartS18 = d3.select(".chartSpr18"),
	chartHistogram = d3.select(".histogram"),
  slider = d3.select(".slider");

var margin = {top: 20, right: 80, bottom: 80, left: 100},
	width = chartF17.attr("width") - margin.left - margin.right,
	height = chartF17.attr("height") - margin.top - margin.bottom,
  sliderWidth = +slider.attr("width") - 70;

var chartF17Graphic = chartF17.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
	chartS18Graphic = chartS18.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
	chartHistogramGraphic = chartHistogram.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
  sliderGraphic = slider.append("g").attr("transform", "translate(35, 35)");

var x = d3.scaleBand().range([0, width]).padding(0.05),
	yF17 = d3.scaleLinear().range([height, 0]),
	yS18 = d3.scaleLinear().range([height, 0]),
	yHistogram = d3.scaleLinear().range([height, 0]);

d3.queue()
	.defer(d3.csv, "https://raw.githubusercontent.com/jemiar/TAvisual/master/fall17data.csv", type)
	.defer(d3.csv, "https://raw.githubusercontent.com/jemiar/TAvisual/master/spring18data.csv", type)
	.await(drawChart);

function drawChart(error, fall17data, spring18data) {
	if(error) { console.log(error); }

	var tempFall17ByClass = d3.nest().
		key(function(d) { return d.classID; }).
	    key(function(d) { return d.week; }).
	    rollup(function(v) { return {
	    	week: v[0].week,
	    	total: d3.sum(v, function(d) { return d.labtime + d.classtime + d.grading + d.officehr + d.classprep + d.other; })
	    	};
	    }).
	    entries(fall17data);

	var fall17ByClass = tempFall17ByClass.map(function(d) { return {
		key: d.key,
		val: weekNo.map(function(w) {
			if(d.values.map(function(k) { return k.value; }).find(function(t) { return t.week == w; }))
				return d.values.map(function(k) { return k.value; }).find(function(t) { return t.week == w;});
			else
				return {week: w, total: 0};
			})
		}
	});

	var tempSpring18ByClass = d3.nest().
    	key(function(d) { return d.classID; }).
    	key(function(d) { return d.week; }).
    	rollup(function(v) { return {
      		week: v[0].week,
      		total: d3.sum(v, function(d) { return d.labtime + d.classtime + d.grading + d.officehr + d.classprep + d.other; })
      		};
    	}).
    	entries(spring18data);

    var spring18ByClass = tempSpring18ByClass.map(function(d) { return {
		key: d.key,
		val: weekNo.map(function(w) {
			if(d.values.map(function(k) { return k.value; }).find(function(t) { return t.week == w; }))
				return d.values.map(function(k) { return k.value; }).find(function(t) { return t.week == w;});
			else
				return {week: w, total: 0};
			})
		}
	});

	x.domain(fall17ByClass[0].val.map(function(d) { return d.week; }));
	yF17.domain([
		d3.min(fall17ByClass[0].val, function(d) { return d.total; }),
		d3.max(fall17ByClass[0].val, function(d) { return d.total; })
		]);

  	console.log(fall17ByClass);
  	console.log(spring18ByClass);

  	chartF17Graphic.append("g")
  		.attr("class", "axisX")
  		.attr("transform", "translate(0," + height + ")")
  		.call(d3.axisBottom(x).ticks(17))
  	.append("text")
  		.attr("transform", "translate(" + width/2 + ", 30)")
  		.attr("y", 8)
  		.attr("dy", "0.71em")
  		.attr("fill", "#000")
  		.attr("text-align", "right")
  		.style("font-size", "30px")
  		.text("Week");

  	chartF17Graphic.append("g")
  		.attr("class", "axisY")
  		.attr("id", "axisYFall17")
  		.call(d3.axisLeft(yF17))
  	.append("text")
  		.attr("transform", "rotate(-90)")
  		.attr("y", 0 - margin.left + 30)
  		.attr("x", 0 - height / 2 + 100)
  		.attr("dy", "0.71em")
  		.attr("fill", "#000")
  		.style("font-size", "30px")
  		.text("Working hours");

  	var f17BarChart = chartF17Graphic.selectAll(".barF17")
  		.data(fall17ByClass[0].val)
  		.enter().append("rect")
  		.attr("class", "barF17")
  		.attr("x", function(d) { return x(d.week); })
  		.attr("width", x.bandwidth())
  		.attr("y", function(d) { return yF17(d.total); })
  		.attr("height", function(d) { return height - yF17(d.total); });

  	var legendFall17Graphic = d3.select(".legendFall17")
  		.append("g")
  		.selectAll(".classFall17")
  		.data(fall17ByClass)
  		.enter().append("g")
  		.attr("class", "classFall17");

  	var classFall17Rect = legendFall17Graphic.append("rect")
  		.attr("class", "classF17Rect")
  		.attr("id", function(d) { return "classF17Rect" + d.key.replace(/\s/g, ''); })
  		.attr("x", function(d, i) {
  			if(i%2 == 0)
  				return 0;
  			else
  				return 75;
  		})
  		.attr("y", function(d, i) {
  			if(i%2 == 0)
  				return i / 2 * 35;
  			else
  				return (i - 1) / 2 * 35;
  		})
  		.attr("width", 70)
  		.attr("height", 30)
  		.attr("fill", "#d9d9d9")
  		.on("click", function(d, i) {
  			classFall17Rect.style("fill", "#d9d9d9");
  			classFall17Text.style("stroke", "#000");
  			d3.select(this).style("fill", "steelblue");
  			classFall17Text._groups[0][i].style.stroke = "#fff";

  			yF17.domain([
  				d3.min(fall17ByClass[i].val, function(d) { return d.total; }),
				d3.max(fall17ByClass[i].val, function(d) { return d.total; })
  				]);

  			d3.select("#axisYFall17")
  				.transition().duration(500)
  				.call(d3.axisLeft(yF17));

  			f17BarChart.data(fall17ByClass[i].val).transition().duration(500)
  				.attr("x", function(d) { return x(d.week); })
  				.attr("width", x.bandwidth())
  				.attr("y", function(d) { return yF17(d.total); })
  				.attr("height", function(d) { return height - yF17(d.total); });
  		});

  	var classFall17Text = legendFall17Graphic.append("text")
  		.text(function(d) { return d.key; })
  		.attr("class", "classF17Text")
  		.attr("x", function(d, i) {
  			if(i%2 == 0)
  				return 10;
  			else
  				return 85;
  		})
  		.attr("y", function(d, i) {
  			if(i%2 == 0)
  				return i / 2 * 35 + 10;
  			else
  				return (i - 1) / 2 * 35 + 10;
  		})
  		.attr("dy", "0.6em")
  		.style("font", "lighter 15px sans-serif")
  		.style("stroke", "#000")
  		.on("click", function(d, i) {
  			classFall17Rect.style("fill", "#d9d9d9");
  			classFall17Text.style("stroke", "#000");
  			d3.select(this).style("stroke", "#fff");
  			classFall17Rect._groups[0][i].style.fill = "steelblue";

  			yF17.domain([
  				d3.min(fall17ByClass[i].val, function(d) { return d.total; }),
				d3.max(fall17ByClass[i].val, function(d) { return d.total; })
  				]);

  			d3.select("#axisYFall17")
  				.transition().duration(500)
  				.call(d3.axisLeft(yF17));

  			f17BarChart.data(fall17ByClass[i].val).transition().duration(500)
  				.attr("x", function(d) { return x(d.week); })
  				.attr("width", x.bandwidth())
  				.attr("y", function(d) { return yF17(d.total); })
  				.attr("height", function(d) { return height - yF17(d.total); });
  		});

  	d3.select(".classF17Rect").style("fill", "steelblue");
  	d3.select(".classF17Text").style("stroke", "#fff");

  	////////////////////////////////////////////////////

  	yS18.domain([
		d3.min(spring18ByClass[0].val, function(d) { return d.total; }),
		d3.max(spring18ByClass[0].val, function(d) { return d.total; })
		]);

  	chartS18Graphic.append("g")
  		.attr("class", "axisX")
  		.attr("transform", "translate(0," + height + ")")
  		.call(d3.axisBottom(x).ticks(17))
  	.append("text")
  		.attr("transform", "translate(" + width/2 + ", 30)")
  		.attr("y", 8)
  		.attr("dy", "0.71em")
  		.attr("fill", "#000")
  		.attr("text-align", "right")
  		.style("font-size", "30px")
  		.text("Week");

  	chartS18Graphic.append("g")
  		.attr("class", "axisY")
  		.attr("id", "axisYSpring18")
  		.call(d3.axisLeft(yS18))
  	.append("text")
  		.attr("transform", "rotate(-90)")
  		.attr("y", 0 - margin.left + 30)
  		.attr("x", 0 - height / 2 + 100)
  		.attr("dy", "0.71em")
  		.attr("fill", "#000")
  		.style("font-size", "30px")
  		.text("Working hours");

  	var s18BarChart = chartS18Graphic.selectAll(".barS18")
  		.data(spring18ByClass[0].val)
  		.enter().append("rect")
  		.attr("class", "barS18")
  		.attr("x", function(d) { return x(d.week); })
  		.attr("width", x.bandwidth())
  		.attr("y", function(d) { return yS18(d.total); })
  		.attr("height", function(d) { return height - yS18(d.total); });

  	var legendSpring18Graphic = d3.select(".legendSpr18")
  		.append("g")
  		.selectAll(".classSpr18")
  		.data(spring18ByClass)
  		.enter().append("g")
  		.attr("class", "classSpr18");

  	var classSpr18Rect = legendSpring18Graphic.append("rect")
  		.attr("class", "classS18Rect")
  		.attr("id", function(d) { return "classS18Rect" + d.key.replace(/\s/g, ''); })
  		.attr("x", function(d, i) {
  			if(i%2 == 0)
  				return 0;
  			else
  				return 75;
  		})
  		.attr("y", function(d, i) {
  			if(i%2 == 0)
  				return i / 2 * 35;
  			else
  				return (i - 1) / 2 * 35;
  		})
  		.attr("width", 70)
  		.attr("height", 30)
  		.attr("fill", "#d9d9d9")
  		.on("click", function(d, i) {
  			classSpr18Rect.style("fill", "#d9d9d9");
  			classSpr18Text.style("stroke", "#000");
  			d3.select(this).style("fill", "#dd1c77");
  			classSpr18Text._groups[0][i].style.stroke = "#fff";

  			yS18.domain([
  				d3.min(spring18ByClass[i].val, function(d) { return d.total; }),
				d3.max(spring18ByClass[i].val, function(d) { return d.total; })
  				]);

  			d3.select("#axisYSpring18")
  				.transition().duration(500)
  				.call(d3.axisLeft(yS18));

  			s18BarChart.data(spring18ByClass[i].val).transition().duration(500)
  				.attr("x", function(d) { return x(d.week); })
  				.attr("width", x.bandwidth())
  				.attr("y", function(d) { return yS18(d.total); })
  				.attr("height", function(d) { return height - yS18(d.total); });
  		});

  	var classSpr18Text = legendSpring18Graphic.append("text")
  		.text(function(d) { return d.key; })
  		.attr("class", "classS18Text")
  		.attr("x", function(d, i) {
  			if(i%2 == 0)
  				return 10;
  			else
  				return 85;
  		})
  		.attr("y", function(d, i) {
  			if(i%2 == 0)
  				return i / 2 * 35 + 10;
  			else
  				return (i - 1) / 2 * 35 + 10;
  		})
  		.attr("dy", "0.6em")
  		.style("font", "lighter 15px sans-serif")
  		.style("stroke", "#000")
  		.on("click", function(d, i) {
  			classSpr18Rect.style("fill", "#d9d9d9");
  			classSpr18Text.style("stroke", "#000");
  			d3.select(this).style("stroke", "#fff");
  			classSpr18Rect._groups[0][i].style.fill = "#dd1c77";

  			yS18.domain([
  				d3.min(spring18ByClass[i].val, function(d) { return d.total; }),
				d3.max(spring18ByClass[i].val, function(d) { return d.total; })
  				]);

  			d3.select("#axisYSpring18")
  				.transition().duration(500)
  				.call(d3.axisLeft(yS18));

  			s18BarChart.data(spring18ByClass[i].val).transition().duration(500)
  				.attr("x", function(d) { return x(d.week); })
  				.attr("width", x.bandwidth())
  				.attr("y", function(d) { return yS18(d.total); })
  				.attr("height", function(d) { return height - yS18(d.total); });
  		});

  	d3.select(".classS18Rect").style("fill", "#dd1c77");
  	d3.select(".classS18Text").style("stroke", "#fff");

  	////////////////////////////////////////////////////

    var currentData;

  	var fall17ByClassFilter = fall17ByClass.filter(function(eF17) {
  		return spring18ByClass.find(function(eS18) { return eF17.key == eS18.key; });
    });
  	console.log(fall17ByClassFilter);

  	var spring18ByClassFilter = spring18ByClass.filter(function(eS18) {
  		return fall17ByClass.find(function(eF17) { return eS18.key == eF17.key; })
  	});
  	console.log(spring18ByClassFilter);

  	var binsFall17Map, binsSpring18Map;

  	function updateData(i, coarseLevel) {
  		var upperLimit = d3.max([
  		(d3.max(fall17ByClassFilter[i].val.map(function(d) { return d.total; })) / 10 + 1) * 10,
  		(d3.max(spring18ByClassFilter[i].val.map(function(d) { return d.total; })) / 10 + 1) * 10
  		]);

  		console.log(upperLimit);
  		

		var xScale = d3.scaleLinear()
			.domain([0, upperLimit])
			.range([0, width]);

		var binsFall17 = d3.histogram()
			.domain(xScale.domain())
			.thresholds(xScale.ticks(upperLimit / coarseLevel))
			(fall17ByClassFilter[i].val.filter(function(e) { return e.total != 0; }).map(function(d) { return d.total; }));

		binsFall17.pop();

		binsFall17Map = binsFall17.map(function(d) {
			return {
				key: "[" + d.x0 + ", " + d.x1 + "]",
				frequency: d.length
			}
		});

		var binsSpring18 = d3.histogram()
			.domain(xScale.domain())
			.thresholds(xScale.ticks(upperLimit / coarseLevel))
			(spring18ByClassFilter[i].val.filter(function(e) { return e.total != 0; }).map(function(d) { return d.total; }));

		binsSpring18.pop();

		binsSpring18Map = binsSpring18.map(function(d) {
			return {
				key: "[" + d.x0 + ", " + d.x1 + "]",
				frequency: d.length
			}
		});

		console.log(binsFall17Map);
  	console.log(binsSpring18Map);
  	}

  	updateData(0, 10);
    currentData = 0;

  	// console.log(binsFall17Map);
  	// console.log(binsSpring18Map);

  	var xHistogram = d3.scaleBand().range([0, width]).padding(0.1);
  	xHistogram.domain(binsFall17Map.map(e => e.key));

  	yHistogram.domain([
  		0,
  		d3.max([
  			d3.max(binsFall17Map.map(e => e.frequency)),
  			d3.max(binsSpring18Map.map(e => e.frequency))
  			])
  		]);

  	chartHistogramGraphic.append("g")
  		.attr("class", "axisX")
  		.attr("id", "axisXHistogram")
  		.attr("transform", "translate(0," + height + ")")
  		.call(d3.axisBottom(xHistogram))
  	.append("text")
  		.attr("transform", "translate(" + width/2 + ", 30)")
  		.attr("y", 8)
  		.attr("dy", "0.71em")
  		.attr("fill", "#000")
  		.attr("text-align", "right")
  		.style("font-size", "30px")
  		.text("Working hours");

  	chartHistogramGraphic.append("g")
  		.attr("class", "axisY")
  		.attr("id", "axisYHistogram")
  		.call(d3.axisLeft(yHistogram))
  	.append("text")
  		.attr("transform", "rotate(-90)")
  		.attr("y", 0 - margin.left + 30)
  		.attr("x", 0 - height / 2 + 100)
  		.attr("dy", "0.71em")
  		.attr("fill", "#000")
  		.style("font-size", "30px")
  		.text("Frequency");

  	var f17Histogram = chartHistogramGraphic.selectAll(".barF17Histogram")
  		.data(binsFall17Map)
  		.enter().append("rect")
  		.attr("class", "barF17Histogram")
  		.attr("x", function(d) { return xHistogram(d.key); })
  		.attr("width", xHistogram.bandwidth() / 2)
  		.attr("y", function(d) { return yHistogram(d.frequency); })
  		.attr("height", function(d) { return height - yHistogram(d.frequency); });

  		console.log(f17Histogram);

  	var s18Histogram = chartHistogramGraphic.selectAll(".barS18Histogram")
  		.data(binsSpring18Map)
  		.enter().append("rect")
  		.attr("class", "barS18Histogram")
  		.attr("x", function(d) { return xHistogram(d.key) + xHistogram.bandwidth() / 2; })
  		.attr("width", xHistogram.bandwidth() / 2)
  		.attr("y", function(d) { return yHistogram(d.frequency); })
  		.attr("height", function(d) { return height - yHistogram(d.frequency); });

  		console.log(s18Histogram);

  	var legendHistogramGraphic = d3.select(".legendHistogram")
  		.append("g")
  		.selectAll(".classHistogram")
  		.data(fall17ByClassFilter)
  		.enter().append("g")
  		.attr("class", "classHistogram");

  	var classHistogramRect = legendHistogramGraphic.append("rect")
  		.attr("class", "classHistogramRect")
  		.attr("id", function(d) { return "classHistogramRect" + d.key.replace(/\s/g, ''); })
  		.attr("x", function(d, i) {
  			if(i%2 == 0)
  				return 0;
  			else
  				return 75;
  		})
  		.attr("y", function(d, i) {
  			if(i%2 == 0)
  				return i / 2 * 35;
  			else
  				return (i - 1) / 2 * 35;
  		})
  		.attr("width", 70)
  		.attr("height", 30)
  		.attr("fill", "#d9d9d9")
  		.on("click", function(d, i) {
  			classHistogramRect.style("fill", "#d9d9d9");
  			classHistogramText.style("stroke", "#000");
  			d3.select(this).style("fill", "#7a0177");
  			classHistogramText._groups[0][i].style.stroke = "#fff";

  			updateData(i, 10);
        currentData = i;

  			xHistogram.domain(binsFall17Map.map(e => e.key));

  			yHistogram.domain([
		  		0,
		  		d3.max([
		  			d3.max(binsFall17Map.map(e => e.frequency)),
		  			d3.max(binsSpring18Map.map(e => e.frequency))
		  			])
		  		]);

  			drawUpdate();
        d3.select(".handle")
          .transition().duration(500)
          .attr("cx", sliderWidth);
		});

  	var classHistogramText = legendHistogramGraphic.append("text")
  		.text(function(d) { return d.key; })
  		.attr("class", "classHistogramText")
  		.attr("x", function(d, i) {
  			if(i%2 == 0)
  				return 10;
  			else
  				return 85;
  		})
  		.attr("y", function(d, i) {
  			if(i%2 == 0)
  				return i / 2 * 35 + 10;
  			else
  				return (i - 1) / 2 * 35 + 10;
  		})
  		.attr("dy", "0.6em")
  		.style("font", "lighter 15px sans-serif")
  		.style("stroke", "#000")
  		.on("click", function(d, i) {
  			classHistogramRect.style("fill", "#d9d9d9");
  			classHistogramText.style("stroke", "#000");
  			d3.select(this).style("stroke", "#fff");
  			classHistogramRect._groups[0][i].style.fill = "#7a0177";

  			updateData(i, 10);
        currentData = i;

  			xHistogram.domain(binsFall17Map.map(e => e.key));

  			yHistogram.domain([
		  		0,
		  		d3.max([
		  			d3.max(binsFall17Map.map(e => e.frequency)),
		  			d3.max(binsSpring18Map.map(e => e.frequency))
		  			])
		  		]);

  			drawUpdate();
        d3.select(".handle")
          .transition().duration(500)
          .attr("cx", sliderWidth);
  		});

  	d3.select(".classHistogramRect").style("fill", "#7a0177");
  	d3.select(".classHistogramText").style("stroke", "#fff");

    function drawUpdate() {

      d3.select("#axisXHistogram")
          .transition().duration(500)
          .call(d3.axisBottom(xHistogram));

      d3.select("#axisYHistogram")
        .transition().duration(500)
        .call(d3.axisLeft(yHistogram));

      var f17Update = chartHistogramGraphic.selectAll(".barF17Histogram").data(binsFall17Map);
      f17Update.exit().remove();
      f17Update.enter()
        .append("rect")
          .attr("class", "barF17Histogram")
          .attr("x", function(d) { return xHistogram(d.key); })
          .attr("width", xHistogram.bandwidth() / 2)
          .attr("y", function(d) { return yHistogram(d.frequency); })
          .attr("height", function(d) { return height - yHistogram(d.frequency); })
        .merge(f17Update).transition().duration(500)
          .attr("x", function(d) { return xHistogram(d.key); })
          .attr("width", xHistogram.bandwidth() / 2)
          .attr("y", function(d) { return yHistogram(d.frequency); })
          .attr("height", function(d) { return height - yHistogram(d.frequency); });

      
      var s18Update = chartHistogramGraphic.selectAll(".barS18Histogram").data(binsSpring18Map);
      s18Update.exit().remove();
      s18Update.enter()
        .append("rect")
          .attr("class", "barS18Histogram")
          .attr("x", function(d) { return xHistogram(d.key) + xHistogram.bandwidth() / 2; })
            .attr("width", xHistogram.bandwidth() / 2)
            .attr("y", function(d) { return yHistogram(d.frequency); })
            .attr("height", function(d) { return height - yHistogram(d.frequency); })
        .merge(s18Update).transition().duration(500)
          .attr("x", function(d) { return xHistogram(d.key) + xHistogram.bandwidth() / 2; })
            .attr("width", xHistogram.bandwidth() / 2)
            .attr("y", function(d) { return yHistogram(d.frequency); })
            .attr("height", function(d) { return height - yHistogram(d.frequency); });
    }

    //////////////////////////////////////////////////////////////////////////////
    //Adding slider
    //////////////////////////////////////////////////////////////////////////////
    var xSlider = d3.scaleLinear()
        .domain([0, 4])
        .range([0, sliderWidth])
        .clamp(true);

    sliderGraphic.append("line")
        .attr("class", "track")
        .attr("x1", xSlider.range()[0])
        .attr("x2", xSlider.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
          .on("start.interrupt", function() { sliderGraphic.interrupt(); })
          .on("start drag", function() { updateSlider(currentData, xSlider.invert(d3.event.x)); })
          );

    sliderGraphic.insert("g", ".track")
        .attr("class", "ticks")
        .attr("transform", "translate(0, -15)")
      .selectAll("text")
      .data([0, sliderWidth])
      .enter().append("text")
        .attr("x", xSlider)
        .attr("text-anchor", "middle")
        .text(function(d) {
          if(d == 0)
            return "Fine";
          else
            return "Coarse";
        })
        .style("font-size", "20px");

    var handle = sliderGraphic.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("cx", xSlider(4))
        .attr("r", 9);

    function updateSlider(i, p) {
      handle.attr("cx", xSlider(p));
      if(p <= 1) {
        updateData(i, 1);
        xHistogram.domain(binsFall17Map.map(e => e.key));

        yHistogram.domain([
          0,
          d3.max([
            d3.max(binsFall17Map.map(e => e.frequency)),
            d3.max(binsSpring18Map.map(e => e.frequency))
            ])
          ]);
        drawUpdate();
      }
      else if(p <= 2 && p > 1) {
        updateData(i, 2);
        xHistogram.domain(binsFall17Map.map(e => e.key));

        yHistogram.domain([
          0,
          d3.max([
            d3.max(binsFall17Map.map(e => e.frequency)),
            d3.max(binsSpring18Map.map(e => e.frequency))
            ])
          ]);
        drawUpdate();
      }
      else if(p <= 3 && p > 2) {
        updateData(i, 5);
        xHistogram.domain(binsFall17Map.map(e => e.key));

        yHistogram.domain([
          0,
          d3.max([
            d3.max(binsFall17Map.map(e => e.frequency)),
            d3.max(binsSpring18Map.map(e => e.frequency))
            ])
          ]);
        drawUpdate();
      }
      else {
        updateData(i, 10);
        xHistogram.domain(binsFall17Map.map(e => e.key));

        yHistogram.domain([
          0,
          d3.max([
            d3.max(binsFall17Map.map(e => e.frequency)),
            d3.max(binsSpring18Map.map(e => e.frequency))
            ])
          ]);
        drawUpdate();
      }
    }
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