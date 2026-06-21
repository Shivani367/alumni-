// src/components/AluminiEmbed.js
import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from 'react-tooltip';

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

const AlumniEmbed = () => {
  const [markers, setMarkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMarkers, setFilteredMarkers] = useState([]);

  useEffect(() => {
    // Professional seed locations for global alumni
    const mockMarkers = [
      { coordinates: [80.2707, 13.0827], name: "Chennai, India", value: 380 },
      { coordinates: [77.5946, 12.9716], name: "Bangalore, India", value: 120 },
      { coordinates: [-122.4194, 37.7749], name: "San Francisco, USA", value: 45 },
      { coordinates: [-74.0060, 40.7128], name: "New York, USA", value: 30 },
      { coordinates: [-0.1278, 51.5074], name: "London, UK", value: 25 },
      { coordinates: [103.8198, 1.3521], name: "Singapore", value: 22 },
      { coordinates: [151.2093, -33.8688], name: "Sydney, Australia", value: 18 },
      { coordinates: [139.6917, 35.6895], name: "Tokyo, Japan", value: 12 },
      { coordinates: [55.2708, 25.2048], name: "Dubai, UAE", value: 15 },
      { coordinates: [2.3522, 48.8566], name: "Paris, France", value: 8 },
      { coordinates: [9.9937, 53.5511], name: "Hamburg, Germany", value: 10 }
    ];
    setMarkers(mockMarkers);
    setFilteredMarkers(mockMarkers);
  }, []);
  
  useEffect(() => {
    const results = markers.filter(marker =>
      marker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marker.value.toString().includes(searchTerm)
    );
    setFilteredMarkers(results);
  }, [searchTerm, markers]);

  return (
    <div className="relative w-full h-[65vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl font-sans">
      
      {/* Search HUD */}
      <div className="absolute top-4 left-4 z-20 w-full max-w-xs p-2 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
        <input 
          type="text"
          className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Filter by city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ComposableMap
        projection="geoMercator"
        className="w-full h-full"
      >
        <ZoomableGroup center={[20, 20]} zoom={1.5}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1e293b" // Dark background fill
                  stroke="#334155" // Stroke line
                  className="outline-none"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#334155", outline: "none" },
                    pressed: { outline: "none" }
                  }}
                />
              ))
            }
          </Geographies>
          {filteredMarkers.map((marker, index) => (
            <Marker key={index} coordinates={marker.coordinates}>
              <circle 
                r={Math.min(12, Math.max(5, Math.sqrt(marker.value) * 1.2))} // Dynamic radius based on member count
                fill="#06b6d4" // Neon cyan fill
                stroke="#ffffff"
                strokeWidth={1.5}
                className="cursor-pointer transition-all duration-300 hover:scale-125 hover:fill-teal-400"
                data-tooltip-id="marker-tooltip"
                data-tooltip-content={`${marker.name}: ${marker.value} Alumni`}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip id="marker-tooltip" className="!bg-slate-950 !border-slate-800 shadow-xl" />
    </div>
  );
};

export default AlumniEmbed;
