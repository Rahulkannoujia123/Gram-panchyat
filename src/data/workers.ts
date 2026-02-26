import { Worker } from '../types';

export const workersData: Worker[] = [
  {
    id: 1,
    name: "राज कुमार",
    phone: "9876543210",
    whatsapp: "9876543210",
    location: {
      village: "पिण्डरा",
      address: "मेन रोड, पिण्डरा"
    },
    serviceType: "Electrician",
    experience: "5-10 years",
    rateCard: {
      standard: 300,
      complex: 500,
      emergency: 400,
      materialsExtra: true
    },
    availability: "Available Now",
    trustScore: {
      verified: true,
      reviews: 15,
      rating: 4.8,
      yearsInService: 8,
      complaints: 0
    }
  },
  {
    id: 2,
    name: "सोनू वर्मा",
    phone: "9123456789",
    whatsapp: "9123456789",
    location: {
      village: "बाबतपुर",
      address: "रेलवे स्टेशन के पास"
    },
    serviceType: "Plumber",
    experience: "2-5 years",
    rateCard: {
      standard: 250,
      complex: 400,
      emergency: 350,
      materialsExtra: true
    },
    availability: "Busy",
    trustScore: {
      verified: true,
      reviews: 8,
      rating: 4.5,
      yearsInService: 3,
      complaints: 1
    }
  },
  {
    id: 3,
    name: "रामू यादव",
    phone: "9988776655",
    whatsapp: "9988776655",
    location: {
      village: "खालिसपुर",
      address: "पंचायत भवन के पीछे"
    },
    serviceType: "Mason",
    experience: "10+ years",
    rateCard: {
      standard: 600,
      complex: 800,
      emergency: 1000,
      materialsExtra: false
    },
    availability: "Available tomorrow",
    trustScore: {
      verified: true,
      reviews: 25,
      rating: 4.9,
      yearsInService: 12,
      complaints: 0
    }
  }
];

export const serviceTypeHindi: Record<string, string> = {
  Electrician: "बिजली का काम (Electrician)",
  Plumber: "नल का काम (Plumber)",
  Carpenter: "लकड़ी का काम (Carpenter)",
  Mason: "राज-गिरी (Mason)",
  Labor: "मजदूरी (Labor)",
  FarmLabor: "खेत का काम (Farm Labor)",
  Painter: "पेंटिंग (Painter)",
  Mechanic: "मोटर-साइकिल (Mechanic)",
  Welder: "वेल्डिंग (Welder)",
  Other: "कोई और (Other)"
};

export const experienceHindi: Record<string, string> = {
  "1 year": "1 साल",
  "2-5 years": "2-5 साल",
  "5-10 years": "5-10 साल",
  "10+ years": "10 साल से ज्यादा"
};

export const availabilityHindi: Record<string, string> = {
  "Available Now": "अभी उपलब्ध है ✓",
  "Busy": "व्यस्त (अगले 3 घंटे)",
  "Available tomorrow": "कल उपलब्ध होगा",
  "On holiday": "छुट्टी पर"
};
