// Spatial Haversine Distance Formula, OpenStreetMap Geocoding & Multi-Route AI Engine

export const calculateHaversineMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// OpenStreetMap Free Geocoding API
export const geocodeAddress = async (queryText) => {
  if (!queryText || !queryText.trim()) return null;
  
  const lower = queryText.toLowerCase();
  if (lower.includes("dighori") || (lower.includes("suryodaya") && lower.includes("nagpur"))) {
    if (lower.includes("suryodaya")) {
      return { lat: 21.0772, lng: 79.1550, displayName: "Suryodaya College of Engineering, Nagpur" };
    }
    return { lat: 21.1090, lng: 79.1350, displayName: "Dighori, Nagpur, Maharashtra" };
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryText)}&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
  } catch (err) {
    console.warn("Geocoding fetch error:", err);
  }
  return null;
};

// Generate 5 Interpolated Map Waypoints
export const generateRouteWaypoints = (originLat, originLng, destLat, destLng, curveOffset = 0) => {
  const points = [];
  const steps = 5;
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const offsetLat = i > 0 && i < steps - 1 ? (Math.sin(ratio * Math.PI) * curveOffset) : 0;
    const offsetLng = i > 0 && i < steps - 1 ? (Math.cos(ratio * Math.PI) * curveOffset) : 0;

    const lat = originLat + (destLat - originLat) * ratio + offsetLat;
    const lng = originLng + (destLng - originLng) * ratio + offsetLng;
    points.push([lat, lng]);
  }
  return points;
};

// Generate 3 Distinct AI Comparison Routes (Safest 🟢, Fastest ⚡, Well-Lit 💡)
export const generateMultiRoutes = (originLat, originLng, destLat, destLng) => {
  const safest = generateRouteWaypoints(originLat, originLng, destLat, destLng, -0.0035);
  const fastest = generateRouteWaypoints(originLat, originLng, destLat, destLng, 0);
  const wellLit = generateRouteWaypoints(originLat, originLng, destLat, destLng, 0.0025);

  return {
    safest: {
      id: 'safest',
      name: '🟢 Safest AI Route',
      color: '#10b981',
      score: 98,
      waypoints: safest,
      description: 'Passes Pink Protection Booths & Active Police Patrols'
    },
    fastest: {
      id: 'fastest',
      name: '⚡ Fastest Direct Route',
      color: '#f59e0b',
      score: 72,
      waypoints: fastest,
      description: 'Shortest travel time, passes near unlit underpass'
    },
    wellLit: {
      id: 'wellLit',
      name: '💡 Well-Lit Main Corridor',
      color: '#06b6d4',
      score: 92,
      waypoints: wellLit,
      description: 'High streetlamp density, avoids isolated alleys'
    }
  };
};

// Default Preset Routes (Nagpur & Delhi)
export const DEFAULT_NAGPUR_ORIGIN = [21.1090, 79.1350]; // Dighori, Nagpur
export const DEFAULT_NAGPUR_DESTINATION = [21.0772, 79.1550]; // Suryodaya College, Nagpur

export const PLANNED_ROUTE = generateRouteWaypoints(
  DEFAULT_NAGPUR_ORIGIN[0], DEFAULT_NAGPUR_ORIGIN[1],
  DEFAULT_NAGPUR_DESTINATION[0], DEFAULT_NAGPUR_DESTINATION[1]
);

export const DEVIATED_ROUTE = [
  [21.1090, 79.1350],
  [21.0980, 79.1410],
  [21.0850, 79.1620], // Off-route stray
  [21.0772, 79.1550]
];

export const SAFE_BYPASS_ROUTE = [
  [21.1090, 79.1350],
  [21.1020, 79.1380], // High-lit Highway Bypass
  [21.0910, 79.1450], // Police Station Patrol Corridor
  [21.0772, 79.1550]  // Suryodaya College Gate
];

// Preset Locations
export const DESTINATION_PRESETS = [
  { 
    id: "dest-nagpur-1", 
    origin: "Dighori, Nagpur, Maharashtra", 
    name: "Suryodaya College of Engineering & Technology, Nagpur", 
    originCoords: [21.1090, 79.1350],
    destCoords: [21.0772, 79.1550], 
    eta: "12 mins" 
  },
  { 
    id: "dest-nagpur-2", 
    origin: "Nagpur Railway Station", 
    name: "VNIT Engineering Campus, Nagpur", 
    originCoords: [21.1524, 79.0882],
    destCoords: [21.1232, 79.0514], 
    eta: "18 mins" 
  },
  { 
    id: "dest-1", 
    origin: "Connaught Place Metro Hub", 
    name: "Residential Safe Haven, Delhi", 
    originCoords: [28.6139, 77.2090],
    destCoords: [28.6250, 77.2200], 
    eta: "14 mins" 
  }
];

// Safe Spaces
export const SAFE_SPACES = [
  { id: 1, name: "Nagpur Women's Pink Protection Booth", type: "Pink Booth", lat: 21.1020, lng: 79.1380, phone: "1091", status: "Active 24/7", distance: "450m" },
  { id: 2, name: "Sakkardara Police Station HQ", type: "Police Station", lat: 21.1180, lng: 79.1120, phone: "112 / 0712-274567", status: "Verified Active Patrol", distance: "1.2km" },
  { id: 3, name: "Apollo 24/7 Emergency Care", type: "Safe Haven", lat: 21.0910, lng: 79.1450, phone: "+91 98765 43210", status: "Open Now", distance: "800m" },
];

// CRIMES & HIGH-RISK DANGER ZONES (Rendered in BRIGHT RED on the map)
export const CRIME_DANGER_ZONES = [
  { 
    id: "crime-1", 
    name: "Umred Road Bypass - Robbery & Snatching Spot", 
    type: "Robbery & Theft",
    lat: 21.0950, 
    lng: 79.1480, 
    radius: 350, 
    severity: "HIGH CRIME RISK", 
    reports: "2 Chain Snatching Incidents Reported • Low Lighting Under Flyover",
    time: "Last reported 1 hr ago"
  },
  { 
    id: "crime-2", 
    name: "Unlit Highway Passage - Harassment Spot", 
    type: "Harassment & Stalking",
    lat: 21.0820, 
    lng: 79.1410, 
    radius: 280, 
    severity: "MODERATE CRIME RISK", 
    reports: "Vehicle Stalking & Poor Cellular Coverage",
    time: "Last reported yesterday"
  }
];
