const svg = d3.select("body")
				.append("svg")
				.attr("width", 1000)
				.attr("height", 650);

const xhr = new XMLHttpRequest();
xhr.open("GET", "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json");
xhr.send();
xhr.onload = function() {
	const us = JSON.parse(xhr.responseText);
	console.log(us)

	xhr.open("GET", "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json");
	xhr.send();
	xhr.onload = function() {
		const edu = JSON.parse(xhr.responseText);
		console.log(edu);

	const legendData = [0, 10, 20, 30, 40, 50, 60, 70];
	const legend = d3.select("#legend")
						.append("svg")
						.attr("width", 1000)
						.attr("height", 200);

	legend.selectAll("rect")
		.data(legendData)
		.enter()
		.append("rect")
		.attr("height", 20)
		.attr("width", 40)
		.attr("x", (d, i) => 800 - i*40)
		.attr("y", 0)
		.attr("fill", (d) => {
			const l = 70 - 70*(d/70) + 20;
			return "hsl(240, 100%, " + l + "%)"
		} )
		.attr("stroke", "black");

	legend.selectAll("text")
		.data(legendData)
		.enter()
		.append("text")
		.attr("x", (d, i) => 810 - i*40)
		.attr("y", 35)
		.text((d) => d + "%")



	

	svg.selectAll("path")
		.data(topojson.feature(us, us.objects.counties).features)
		.enter()
		.append("path")
		.attr("d", d3.geoPath())
		.attr("class", "county")
		.attr("data-fips", (d) => d.id)
		.attr("data-education", (d) => {
			const matched = edu.filter( (x) => d.id == x.fips);
			return matched[0].bachelorsOrHigher;
			})
		.attr("fill", (d) => {
			const matched = edu.filter( (x) => d.id == x.fips);
			const l = 70 - 70*(matched[0].bachelorsOrHigher/70) + 20;
			return "hsl(240, 100%, " + l + "%)"  
		})
		.attr("stroke", "white")
		.on("mouseover", (d) => {
			const matched = edu.filter( (x) => d.id == x.fips);
			const tooltip = document.getElementById("tooltip");
			tooltip.setAttribute("data-education", matched[0].bachelorsOrHigher)
			tooltip.innerHTML = "<p>" + matched[0].area_name + "</p>";
			tooltip.innerHTML += "<p>" + matched[0].bachelorsOrHigher + "%</p>";
			tooltip.style.left = event.pageX - 50 + "px";
			tooltip.style.top = event.pageY - 75 + "px";
			tooltip.style.display = "inline";
		})
		.on("mouseout", (d) => {
			document.getElementById("tooltip").style.display = "none";
		})
	}
}