// Digital Police FIR & Emergency Complaint Management Service

export const generateFirNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `FIR-2026-DEL-${randomNum}`;
};

export const generateWhatsAppShareUrl = (userName, lat, lng, origin, destination) => {
  const text = encodeURIComponent(
    `🚨 EMERGENCY ALERT from ${userName}!\nI am currently in distress. Live GPS Tracking: https://maps.google.com/?q=${lat},${lng}\nTrip: ${origin} → ${destination}\nPlease send help or inform Police (112)!`
  );
  return `https://api.whatsapp.com/send?text=${text}`;
};

export const generateTwilioSmsBody = (userName, lat, lng) => {
  return `🚨 SMARTGUARD EMERGENCY SOS! User ${userName} triggered panic alert at Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}. Live GPS: https://maps.google.com/?q=${lat},${lng}`;
};

export const INITIAL_POLICE_COMPLAINTS = [
  {
    firNumber: "FIR-2026-DEL-74892",
    date: "2026-09-14 21:30",
    category: "Attempted Theft",
    complainantName: "Sahil Bode",
    phone: "+91 98765 43210",
    location: "Metro Station Exit Gate 3",
    description: "Suspicious individual attempted snatching personal bag near unlit underpass. ESP32-CAM stealth snapshot attached.",
    policeStation: "Central Police HQ Station (District 4)",
    stolenProperty: "Black leather shoulder bag, ID cards",
    status: "REGISTERED & UNDER INVESTIGATION",
    hash: "0x8f3c2a4e91b0d745a1e2f3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
    camSnapshot: "https://images.unsplash.com/photo-1508873696983-2df515122519?w=400&auto=format&fit=crop&q=60"
  }
];

export const POLICE_STATIONS = [
  {
    id: "PS-01",
    name: "Central Police HQ Station",
    jurisdiction: "Connaught Central Corridor",
    controlRoomPhone: "112 / 011-23456789",
    officerInCharge: "Insp. Vikram Singh",
    lat: 28.6220,
    lng: 77.2150,
    activePatrols: 4
  },
  {
    id: "PS-02",
    name: "Women Security Special Cell",
    jurisdiction: "University & Metro Hub",
    controlRoomPhone: "1091 / 011-98765432",
    officerInCharge: "Insp. Meenakshi Roy",
    lat: 28.6160,
    lng: 77.2120,
    activePatrols: 6
  }
];
