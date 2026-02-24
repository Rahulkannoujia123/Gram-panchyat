# Village API Integration - Prindra Block, Varanasi

## Overview
यह documentation Prindra block के villages को fetch करने के लिए API integration के बारे में है।

## Architecture

### Data Flow
```
VillagesPage Component
    ↓
useVillages Hook
    ↓
villageService.ts (Multiple API sources)
    ↓
Fallback: Local hardcoded data (data.ts)
```

### API Priority
1. **OpenDataStack** - https://opendatastack.in/api/villages
2. **data.gov.in** - https://www.data.gov.in/api/3/action/datastore_search_sql
3. **Wikipedia API** - https://en.wikipedia.org/w/api.php (Info only)
4. **Local Fallback** - 15 hardcoded villages in `src/data.ts`

## Files Structure

```
src/
├── hooks/
│   └── useVillages.ts                 # React hook for fetching villages
├── services/
│   └── villageService.ts               # API service layer
├── data.ts                             # Fallback village data
└── pages/
    └── VillagesPage.tsx                # UI component using useVillages hook
```

## API Details

### 1. OpenDataStack API
**Status**: Optional (Free tier available)
**Endpoint**: `https://opendatastack.in/api/villages`
**Parameters**:
- state: "Uttar Pradesh"
- district: "Varanasi"
- block: "Pindra"

**Example**:
```bash
curl "https://opendatastack.in/api/villages?state=Uttar Pradesh&district=Varanasi&block=Pindra"
```

### 2. data.gov.in CKAN API
**Status**: Public (No authentication required)
**Endpoint**: `https://www.data.gov.in/api/3/action/datastore_search_sql`
**Dataset**: Local Government Directory (LGD) - Villages with PIN Codes
**Resource ID**: f0aedc01-2e2d-4e6e-b926-6b5e1f47ab45

**Example Query**:
```sql
SELECT * FROM "f0aedc01-2e2d-4e6e-b926-6b5e1f47ab45" 
WHERE "stateNameEnglish"='Uttar Pradesh' 
AND "districtNameEnglish"='Varanasi' 
AND "subdistrictNameEnglish"='Pindra' 
LIMIT 1000
```

### 3. Wikipedia API
**Status**: Public (No authentication required)
**Use**: Additional context about Pindra block
**Endpoint**: `https://en.wikipedia.org/w/api.php`

## Implementation Details

### useVillages Hook
```typescript
const { villages, loading, error, refetch } = useVillages();
```

**Returns**:
- `villages`: Array of Village objects
- `loading`: Boolean - true while fetching
- `error`: String | null - Error message if any
- `refetch`: Function - Manually trigger refetch

### Village Interface
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

## Testing

### Local Development
```bash
npm start
# Navigate to Villages section
# Check browser console for API logs
```

### Debug Logs
The implementation includes detailed console logs:
```
[VillageService] Trying OpenDataStack...
[VillageService] Successfully fetched X villages from OpenDataStack
[useVillages] Using API data: X villages
```

### Error Handling
- If all external APIs fail, the app automatically uses fallback local data
- User sees a yellow warning banner: "बाहरी API उपलब्ध नहीं है, स्थानीय डेटा का उपयोग किया जा रहा है"
- Loading spinner shows while fetching

## Offline Support
- Complete fallback data for 15 villages is built-in
- App works completely offline using local data
- Users can still search and filter villages offline

## Future Enhancements

1. **Caching**: Add localStorage or IndexedDB caching
2. **Real-time Updates**: Use webhooks for data updates
3. **More Data**: Add population demographics, infrastructure details
4. **Sync**: Background sync when offline data is available

## Related Files
- `src/data.ts` - Contains fallback village data
- `src/types/index.ts` - Village interface definitions
- `src/pages/VillagesPage.tsx` - Main UI component
- `src/pages/VillageDetailPage.tsx` - Village details view

## Notes
- Prindra coordinates: State Code: 36, District Code: 100, SubDistrict Code: 9
- Data updated monthly from data.gov.in (Last update: 01-12-2025)
- All APIs have 5-second timeout to prevent hanging
