import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SAFE_SPACES, CRIME_DANGER_ZONES } from '../services/locationService';

// Fix Leaflet Default Icon in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to smoothly re-center map when Origin/Destination changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

// Custom Leaflet DivIcons
const createCustomIcon = (color, emoji, pulse = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 19px;
        box-shadow: 0 0 ${pulse ? '25px' : '15px'} ${color};
        border: 2px solid #ffffff;
        position: relative;
      ">
        ${emoji}
        ${pulse ? `<span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px solid ${color}; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>` : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const userIcon = createCustomIcon('#3b82f6', '👤');
const userSosIcon = createCustomIcon('#ef4444', '🚨', true);
const policeIcon = createCustomIcon('#2563eb', '👮');
const pinkBoothIcon = createCustomIcon('#ec4899', '🌸');
const safeHavenIcon = createCustomIcon('#10b981', '🛡️');
const crimeRedIcon = createCustomIcon('#dc2626', '🚨', true);

const originIcon = createCustomIcon('#6366f1', '📍');
const destinationIcon = createCustomIcon('#10b981', '🏁', true);

export default function MapComponent({
  currentPos,
  breadcrumbs,
  sosActive,
  mapStyle = 'dark',
  routeMode = 'normal',
  userProfile,
  userSpeed = 4.2,
  batteryLevel = 86,
  communityIncidents = [],
  destinationName = "Suryodaya College of Engineering & Technology, Nagpur",
  originName = "Dighori, Nagpur, Maharashtra",
  originCoords = [21.1090, 79.1350],
  destCoords = [21.0772, 79.1550],
  dynamicRoute = [],
  multiRoutes = null,
  activeRouteId = 'safest'
}) {
  const tileUrl = mapStyle === 'satellite' 
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' 
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const routePoints = dynamicRoute && dynamicRoute.length > 0 ? dynamicRoute : [originCoords, destCoords];

  return (
    <div className={`w-full h-full ${mapStyle === 'dark' ? 'dark-tiles' : mapStyle === 'satellite' ? 'satellite-tiles' : ''}`}>
      <MapContainer 
        center={currentPos || originCoords} 
        zoom={14} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <MapRecenter center={currentPos || originCoords} />

        <TileLayer 
          attribution='&copy; OpenStreetMap' 
          url={tileUrl} 
        />

        {/* Starting Origin Marker */}
        <Marker position={originCoords} icon={originIcon}>
          <Popup>
            <div className="p-1 font-sans">
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                📍 STARTING ORIGIN
              </span>
              <h4 className="font-bold text-slate-100 mt-1">{originName}</h4>
            </div>
          </Popup>
        </Marker>

        {/* Target Destination Marker */}
        <Marker position={destCoords} icon={destinationIcon}>
          <Popup>
            <div className="p-1 font-sans">
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                🏁 TARGET DESTINATION
              </span>
              <h4 className="font-bold text-slate-100 mt-1">{destinationName}</h4>
            </div>
          </Popup>
        </Marker>

        {/* MULTI-ROUTE AI COMPARISON POLYLINES (Safest 🟢, Fastest ⚡, Well-Lit 💡) */}
        {multiRoutes ? (
          <>
            {/* 1. Safest Route Polyline */}
            <Polyline 
              positions={multiRoutes.safest.waypoints} 
              pathOptions={{ 
                color: multiRoutes.safest.color, 
                weight: activeRouteId === 'safest' ? 7 : 4, 
                opacity: activeRouteId === 'safest' ? 0.95 : 0.45,
                dashArray: activeRouteId === 'safest' ? null : '6, 6'
              }} 
            />

            {/* 2. Fastest Route Polyline */}
            <Polyline 
              positions={multiRoutes.fastest.waypoints} 
              pathOptions={{ 
                color: multiRoutes.fastest.color, 
                weight: activeRouteId === 'fastest' ? 7 : 4, 
                opacity: activeRouteId === 'fastest' ? 0.95 : 0.45,
                dashArray: activeRouteId === 'fastest' ? null : '6, 6'
              }} 
            />

            {/* 3. Well-Lit Corridor Polyline */}
            <Polyline 
              positions={multiRoutes.wellLit.waypoints} 
              pathOptions={{ 
                color: multiRoutes.wellLit.color, 
                weight: activeRouteId === 'wellLit' ? 7 : 4, 
                opacity: activeRouteId === 'wellLit' ? 0.95 : 0.45,
                dashArray: activeRouteId === 'wellLit' ? null : '6, 6'
              }} 
            />
          </>
        ) : (
          /* Single Fallback Polyline */
          <Polyline 
            positions={routePoints} 
            pathOptions={{ 
              color: routeMode === 'bypass' ? '#06b6d4' : '#10b981', 
              weight: 6, 
              opacity: 0.85, 
              dashArray: '8, 8' 
            }} 
          />
        )}

        {/* Live User Trajectory Breadcrumbs */}
        <Polyline 
          positions={breadcrumbs} 
          pathOptions={{ color: sosActive ? '#ef4444' : '#3b82f6', weight: 6, opacity: 0.95 }} 
        />

        {/* User Current Position Marker */}
        <Marker position={currentPos || originCoords} icon={sosActive ? userSosIcon : userIcon}>
          <Popup>
            <div className="p-1 font-sans">
              <h4 className="font-bold text-slate-100">👤 {userProfile?.name || 'User'}</h4>
              <p className="text-xs text-slate-300 mt-1">Speed: {userSpeed} km/h • Battery: {batteryLevel}%</p>
              <p className="text-[10px] text-indigo-400 font-mono mt-0.5">Origin: {originName}</p>
              <p className="text-[10px] text-emerald-400 font-mono">Destination: {destinationName}</p>
            </div>
          </Popup>
        </Marker>

        {/* Verified Safe Haven Pins */}
        {SAFE_SPACES.map(space => (
          <Marker 
            key={space.id} 
            position={[space.lat, space.lng]} 
            icon={space.type === 'Pink Booth' ? pinkBoothIcon : space.type === 'Police Station' ? policeIcon : safeHavenIcon}
          >
            <Popup>
              <div className="p-1 font-sans">
                <span className="text-[10px] uppercase font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                  {space.type}
                </span>
                <h4 className="font-bold text-slate-100 mt-1">{space.name}</h4>
                <p className="text-xs text-slate-300">📞 Helpline: {space.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* BRIGHT RED CRIME INCIDENTS & RED DANGER ZONES */}
        {CRIME_DANGER_ZONES.map(zone => (
          <React.Fragment key={zone.id}>
            <Circle 
              center={[zone.lat, zone.lng]} 
              radius={zone.radius} 
              pathOptions={{ 
                color: '#ef4444', 
                fillColor: '#ef4444', 
                fillOpacity: 0.35, 
                weight: 2.5,
                dashArray: '6, 6'
              }}
            >
              <Tooltip permanent={false}>🚨 CRIME ZONE: {zone.name}</Tooltip>
            </Circle>

            <Marker position={[zone.lat, zone.lng]} icon={crimeRedIcon}>
              <Popup>
                <div className="p-1.5 font-sans max-w-xs">
                  <span className="text-[10px] uppercase font-extrabold text-white bg-rose-600 px-2 py-0.5 rounded">
                    🚨 {zone.severity}
                  </span>
                  <h4 className="font-extrabold text-rose-400 text-xs mt-1">{zone.name}</h4>
                  <p className="text-xs text-slate-200 mt-1 font-semibold">{zone.type}</p>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">{zone.reports}</p>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 block">{zone.time}</span>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* User Community Incident Tag Markers */}
        {communityIncidents.map((incident) => (
          <Marker 
            key={incident.id} 
            position={[originCoords[0] + (Math.random() * 0.004 - 0.002), originCoords[1] + (Math.random() * 0.004 - 0.002)]} 
            icon={crimeRedIcon}
          >
            <Popup>
              <div className="p-1 font-sans">
                <span className="text-[10px] uppercase font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded">
                  🚨 COMMUNITY CRIME TAG
                </span>
                <h4 className="font-bold text-slate-100 mt-1">{incident.location}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{incident.issue}</p>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}
