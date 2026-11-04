// Curated featured providers from real Cyber AB data
// These IDs correspond to real entries in public/providers.json
export const FEATURED = [
  {
    storeId: 43964,
    name: "A-LIGN",
    type: "C3PAO",
    city: "Tampa", state: "FL",
    website: "https://www.a-lign.com",
    tagline: "One of the most recognized compliance firms in the defense industrial base, with hundreds of CMMC assessments completed.",
    highlight: "High-volume C3PAO",
  },
  {
    storeId: 35336,
    name: "112Cyber",
    type: "C3PAO",
    city: "Clearwater", state: "FL",
    website: "https://www.112cyber.com",
    tagline: "Cyber-focused C3PAO specializing in defense contractors of all sizes, with deep expertise in NIST 800-171 implementation.",
    highlight: "DIB Specialist",
  },
  {
    storeId: 45098,
    name: "Ariento Inc.",
    type: "C3PAO",
    city: "Franklin", state: "TN",
    website: "https://www.ariento.com",
    tagline: "CMMC assessor and compliance partner known for practical, contractor-focused guidance from readiness through certification.",
    highlight: "Practical Approach",
  },
  {
    storeId: 46985,
    name: "Ace of Cloud Inc.",
    type: "C3PAO",
    city: "Herndon", state: "VA",
    website: "https://www.aceofcloud.com",
    tagline: "Northern Virginia C3PAO with particular depth in cloud environments and DoD contractor IT infrastructure.",
    highlight: "Cloud-Native",
  },
  {
    storeId: 51936,
    name: "August Schell Enterprises",
    type: "C3PAO",
    city: "Rockville", state: "MD",
    website: "https://augustschell.com",
    tagline: "Established Maryland-based IT and cybersecurity firm with long history serving federal and DoD customers.",
    highlight: "Federal Heritage",
  },
  {
    storeId: 49706,
    name: "ATX Defense",
    type: "C3PAO",
    city: "Austin", state: "TX",
    website: "https://www.atxdefense.com",
    tagline: "Defense-focused cybersecurity firm built specifically for the CMMC program, serving contractors in TX and nationwide.",
    highlight: "Defense-First",
  },
];

// Which needs map to which provider types
export const NEED_TO_TYPE = {
  gap:        ['RPO', 'C3PAO'],
  assessment: ['C3PAO'],
  training:   ['LTP', 'RPO'],
  ongoing:    ['RPO', 'RPA'],
  docs:       ['RPO', 'RPA'],
};
