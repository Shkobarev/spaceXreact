import * as d3 from "d3";
import * as Geo from "../geo.json";
import { useEffect, useRef } from "react";

function Map({ launchpads, activeLaunchpadId }) {
    const width = 640;
    const height = 480;

    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 100
    };

    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const geoData = Geo.default ?? Geo;

        const svg = d3
            .select(containerRef.current)
            .selectAll("svg")
            .data([null])
            .join("svg")
            .attr(
                "viewBox",
                `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
            );

        svg.selectAll("*").remove();

        const viewport = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const mapGroup = viewport.append("g");

        const projection = d3.geoMercator()
            .scale(100)
            .center([0, 20])
            .translate([
                width / 2 - margin.left,
                height / 2
            ]);

        const geoPath = d3.geoPath().projection(projection);

        mapGroup
            .selectAll("path")
            .data(geoData.features)
            .join("path")
            .attr("class", "topo")
            .attr("d", geoPath);

        mapGroup
            .selectAll("circle")
            .data(launchpads, pad => pad.id)
            .join("circle")
            .attr("class", "launchpad-dot")
            .attr("cx", pad =>
                projection([+pad.longitude, +pad.latitude])[0]
            )
            .attr("cy", pad =>
                projection([+pad.longitude, +pad.latitude])[1]
            )
            .attr("r", 5)
            .attr("fill", "steelblue")
            .append("title")
            .text(pad => pad.name);

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", event => {
                mapGroup.attr("transform", event.transform);
            });

        svg.call(zoom);

        return () => {
            svg.on(".zoom", null);
        };

    }, [launchpads]);

    useEffect(() => {
        if (!containerRef.current) return;

        d3.select(containerRef.current)
            .selectAll(".launchpad-dot")
            .classed("active", pad =>
                activeLaunchpadId !== null &&
                String(pad.id) === String(activeLaunchpadId)
            )
            .attr("r", pad =>
                activeLaunchpadId !== null &&
                String(pad.id) === String(activeLaunchpadId)
                    ? 8
                    : 5
            );

    }, [activeLaunchpadId, launchpads]);

    return (
        <section className="content">
            <div
                className="mapContainer map"
                ref={containerRef}
            />
        </section>
    );
}

export { Map };
