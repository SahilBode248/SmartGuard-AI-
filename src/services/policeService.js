// Digital Police FIR & Emergency Complaint Management Service

export const generateFirNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `FIR-2026-DEL-${randomNum}`;
};

export const INITIAL_POLICE_COMPLAINTS = [
  {
    firNumber: "FIR-2026-DEL-74892",
    date: "2026-09-14 21:30",
    category: "Attempted Theft",
    complainantName: "Sahil Bode",
    phone: "+91 98765 43210",
    location: "Metro Station Exit Gate 3",
    description: "Suspicious individual attempted snatching personal bag near unlit underpass.",
    policeStation: "Central Police HQ Station (District 4)",
    stolenProperty: "Black leather shoulder bag, ID cards",
    status: "REGISTERED & UNDER INVESTIGATION",
    hash: "0x9f4a12b...88c3"
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
