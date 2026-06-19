import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from 'react-tooltip';
import supabase from '../supabaseClient';

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

const AlumniEmbed = () => {
  const [markers, setMarkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMarkers, setFilteredMarkers] = useState([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      const { data, error } = await supabase.rpc('get_alumni_counts');
    
      if (error) {
        console.error('Error fetching markers:', error);
      } else {
        console.log(data); // Log data to verify structure
        const formattedMarkers = data.map((item) => ({
          coordinates: [item.coordinates[1], item.coordinates[0]], // Reverse order for map projection
          value: item.count, // Alumni count
        }));
        
        setMarkers(formattedMarkers);
        setFilteredMarkers(formattedMarkers);
      }
    };
  
    fetchMarkers();
  }, []);
  
  useEffect(() => {
    const results = markers.filter(marker =>
      marker.value.toString().includes(searchTerm) ||
      JSON.stringify(marker.coordinates).includes(searchTerm)
    );
    setFilteredMarkers(results);
  }, [searchTerm, markers]);

  return (
    <div className="relative w-full h-[60vh] bg-gray-100">
      <ComposableMap
        projection="geoMercator"
        className="w-full h-full"
      >
        <ZoomableGroup center={[0, 20]} zoom={1.5}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#A2D2FF" // Light blue fill for a colorful effect
                  stroke="#00509E" // Darker blue stroke for contrast
                  className="outline-none"
                />
              ))
            }
          </Geographies>
          {filteredMarkers.map((marker, index) => (
            <Marker key={index} coordinates={marker.coordinates}>
              <circle 
                r={Math.sqrt(marker.value) * 4} // Adjust circle size based on alumni count
                fill="#FF5733" // Use a distinct color for visibility
                stroke="#333"
                strokeWidth={1}
                className="cursor-pointer transition-all duration-300 hover:opacity-80"
                data-tooltip-id="marker-tooltip"
                data-tooltip-content={`Alumni: ${marker.value}`}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip id="marker-tooltip" />
    </div>
  );
};

export default AlumniEmbed;
