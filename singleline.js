// var test = d3.selectAll("input[type=radio][name=chartType");
// console.log(test);
// test.on("change", function() {
// 	console.log(this.value);
// });

//Array used for week numbering
var weekNo = [
	1, 2, 3, 4,
	5, 6, 7, 8,
	9, 10, 11, 12,
	13, 14, 15, 16, 17
];

//store raw data after reading csv files
var rawDataFall17, rawDataSpring18;

//Read data from 2 files, then use await() when finish reading and call assignData function
//callback function type() used for convert string to number
d3.queue()
	.defer(d3.csv, "https://raw.githubusercontent.com/jemiar/TAvisual/master/fall17data.csv", type)
	.defer(d3.csv, "https://raw.githubusercontent.com/jemiar/TAvisual/master/spring18data.csv", type)
	.await(assignData);

//type function: convert string to number
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

function assignData(error, dataFall17, dataSpring18) {
	if(error) throw error;
	rawDataFall17 = dataFall17;
	rawDataSpring18 = dataSpring18;
	console.log(rawDataFall17);
	console.log(rawDataSpring18);
	var test = d3.nest()
					.key(function(d) { return d.classID; })
					.key(function(d) { return d.semester; })
					.key(function(d) { return d.week; })
					.rollup(function(v) { return {
						week: v[0].week,
						total: d3.sum(v, function(d) { return d.labtime + d.classtime + d.grading + d.officehr + d.classprep + d.other; })
						};
					})
					.entries(dataFall17);
	console.log(test);
}