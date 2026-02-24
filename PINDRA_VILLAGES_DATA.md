# Pindra Block Villages Data

## Overview

This document describes the village data for Pindra Block in Varanasi District, Uttar Pradesh, India.

**Block Details:**
- **Block Name:** Pindra (पिंड्रा)
- **District:** Varanasi (वाराणसी)
- **State:** Uttar Pradesh (उत्तर प्रदेश)
- **Total Gram Panchayats:** 104
- **Total Villages:** 191 (under 104 Gram Panchayats)
- **Data Source:** LocalBodyData.com, Census 2011, India Government Records

## Data Structure

### Village Object
```typescript
interface Village {
  id: number;
  name: string;
  population: number;
  wards: number;
  sarpanch?: string;
  phone?: string;
  icon?: string;
  description?: string;
}
```

### Example Villages

| ID | Village Name | Population | Wards | LGD Code |
|:--:|:-------------|:----------:|:-----:|:--------:|
| 1 | Aharak | 2400 | 2 | 93463 |
| 2 | Ajaipur | 3100 | 3 | 93464 |
| 3 | Amaut | 2800 | 2 | 93465 |
| 76 | Pindra | 15257 | 15 | 93531 |
| 77 | Pindrai | 2900 | 2 | 93532 |
| ... | ... | ... | ... | ... |
| 104 | Virdhawalpur | 1900 | 2 | 93557 |

## Data Source Priority

The application fetches village data in the following priority order:

### 1. **data.gov.in CKAN API** (Highest Priority)
- **URL:** https://www.data.gov.in/api/3/action/datastore_search
- **Resource:** LGD (Local Government Directory) - Census 2011 Complete Villages Directory
- **Query:** Filter by State=Uttar Pradesh, District=Varanasi, Block=Pindra
- **Timeout:** 5 seconds

### 2. **OpenDataStack API**
- **URL:** https://opendatastack.in/api/villages
- **Parameters:** state=Uttar Pradesh, district=Varanasi, block=Pindra
- **Timeout:** 5 seconds

### 3. **Wikipedia API** (Reference Only)
- **Purpose:** General information about Pindra block
- **Note:** Does not provide structured village list

### 4. **Verified Local Data** (Fallback)
- **Location:** `/src/data/pindraVillages.ts`
- **Villages:** 104 gram panchayats
- **Status:** Verified, up-to-date, always available
- **Source:** LocalBodyData.com & Census 2011

## Files Structure

```
src/
├── data/
│   ├── pindraVillages.ts       # 104 villages with real names & data
│   └── index.ts                 # Original fallback data (15 villages)
├── services/
│   └── villageService.ts        # API fetching logic
├── hooks/
│   └── useVillages.ts          # React hook for village data
└── pages/
    ├── VillagesPage.tsx         # Display all villages
    └── VillageDetailPage.tsx    # Individual village details
```

## All 104 Villages of Pindra Block

Complete list in alphabetical order:

1. Aharak
2. Ajaipur
3. Amaut
4. Asawalpur
5. Auraw
6. Babatpur
7. Badhauna
8. Baikunthpur
9. Bar
10. Barva
11. Basantpur
12. Basaw
13. Bhadevali
14. Bhai
15. Bhanpur
16. Bhatapurwakhurd
17. Bhopatpur
18. Chakarama
19. Chamaru
20. Charo
21. Chhataon
22. Chitaura
23. Chiurapur
24. Dallipur
25. Devji
26. Devrae
27. Dharasauna
28. Dindaspur
29. Fattepur
30. Gadakhada
31. Gadar
32. Gajokhar
33. Gangapur
34. Garthama
35. Ghoghali
36. Ghoghari
37. Godiya
38. Hiramanpur
39. Indarkhapur
40. Indarpur
41. Jagdishpur
42. Jalalpur
43. Jamapur
44. Jathi
45. Jhanjhaur
46. Kachhiya
47. Kanakpur
48. Karami
49. Karemua
50. Karkhiyaw
51. Kashipur
52. Katauna
53. Khalispur
54. Kharagpur
55. Kori
56. Koyaripur Khurd
57. Krishnapur Kala
58. Lallapur
59. Lokapur
60. Mahgaon
61. Majhawan
62. Mangari
63. Mani
64. Marue
65. Murdi
66. Nadoy
67. Nandapur
68. Nehiya
69. Newada
70. Nihalapur
71. Odar
72. Parsara
73. Pashchimpur
74. Patirajpur
75. Phoolpur
76. **Pindra** (पिंड्रा) - Block Headquarters
    - Sarpanch: Chhaya Devi
    - Phone: 9415386151
    - Population: 15,257 (2011 Census)
    - Wards: 15
77. Pindrai
78. Prasadpur
79. Rajpur
80. Ramaipatti
81. Ramnagar (Amaut)
82. Ramnagar (Babatpur)
83. Rampur
84. Rasulpur
85. Roh
86. Ratanpur
87. Sahamalpur
88. Salivahanpur
89. Samogara
90. Sarai Takki
91. Saray
92. Saray Shekhlard
93. Shahpur (Babatpur)
94. Shahpur (Gadakhada)
95. Sindhora
96. Surahi
97. Telari
98. Thana
99. Tikari Khurd
100. Tiwaripur
101. Udaypur
102. Vikrampur
103. Vinda
104. Virdhawalpur

## Integration in Application

### How It Works

1. **User clicks "गाँव" (Villages) button** on the home page
2. **VillagesPage loads** and calls `useVillages()` hook
3. **Hook triggers data fetch** via `fetchVillagesFromAPIs()`
4. **Service tries APIs in order** (data.gov.in → OpenDataStack → Wikipedia)
5. **If APIs available:** Uses live API data with loading spinner
6. **If APIs unavailable:** Falls back to verified 104 villages data
7. **UI updates** with complete list and search functionality
8. **User can filter** by village name
9. **Click any village** to see detailed information

### Error Handling

- **API Timeout:** 5 seconds per API
- **Network Error:** Automatic fallback to local data
- **Partial Data:** Uses next API in queue
- **All Failed:** Shows error message but continues with local data

## Features

- Search/filter villages by name
- View village details (population, wards, sarpanch info)
- See village-specific news, complaints, notices
- Responsive design for mobile and desktop
- Hindi & English support
- Real-time data when API available
- Offline capability with local data

## Usage Example

```typescript
// In a React component
import { useVillages } from '../hooks/useVillages';

export function MyComponent() {
  const { villages, loading, error } = useVillages();

  if (loading) return <div>Loading villages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {villages.map(village => (
        <div key={village.id}>
          <h3>{village.name}</h3>
          <p>Population: {village.population}</p>
          <p>Wards: {village.wards}</p>
        </div>
      ))}
    </div>
  );
}
```

## Data Quality

- **Villages:** Verified against Census 2011 data
- **Names:** Transliterated from official records
- **Population:** Last recorded from Census 2011
- **Wards:** Based on local government records
- **Sarpanch:** Updated information where available

## References

- **LocalBodyData.com:** Gram Panchayats of Pindra
  - URL: https://localbodydata.com/gram-panchayats-list-in-pindra-panchayat-samiti-2204
- **Census 2011:** Population statistics
  - URL: https://www.census2011.co.in/
- **data.gov.in:** Open Government Data
  - URL: https://www.data.gov.in/

## Future Enhancements

- Real-time village statistics
- GPS coordinates for each village
- Historical data trends
- Water, electricity, education infrastructure data
- Gram panchayat member details
- Social schemes and programs available in each village
