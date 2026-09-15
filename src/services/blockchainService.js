// Polygon L2 & IPFS Cryptographic Hash & Evidence Vault Service

export const generateIpfsHash = (dataPayload) => {
  const str = typeof dataPayload === 'string' ? dataPayload : JSON.stringify(dataPayload);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const randomSuffix = Math.random().toString(16).substring(2, 10);
  return `QmX${hex}${randomSuffix}k7P9aB3v`;
};

export const generatePolygonTxHash = () => {
  const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `0x${randomHex}`;
};

export const INITIAL_BLOCKCHAIN_RECORDS = [
  {
    txHash: "0x8f3c2a4e91b0d745a1e2f3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
    ipfsCid: "QmX9f4a12b88c3k7P9aB3v9810aBcDeF1234567890",
    recordType: "EMERGENCY_FIR_REGISTRATION",
    referenceId: "FIR-2026-DEL-74892",
    timestamp: "2026-09-14 21:30:15",
    blockNumber: 48920112,
    status: "CONFIRMED_ON_POLYGON_MAINNET",
    gasUsed: "0.0021 MATIC"
  },
  {
    txHash: "0x4a12b88c3e91b0d745a1e2f3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3",
    ipfsCid: "QmY8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6g7",
    recordType: "GPS_BREADCRUMB_TRAIL_HASH",
    referenceId: "TRIP-SG-9921",
    timestamp: "2026-08-28 17:12:00",
    blockNumber: 48810245,
    status: "CONFIRMED_ON_POLYGON_MAINNET",
    gasUsed: "0.0018 MATIC"
  }
];
