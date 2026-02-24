# Village Filtering & Pradhan Data Integration Guide

## Overview
Complete implementation of village-wise filtering system with:
- Dropdown autocomplete village selector
- Real-time Pradhan (Sarpanch) data fetching
- Population data from Census 2011 and third-party APIs
- Village-specific content filtering

## New Components

### 1. VillageSelector Component
**Location**: `src/components/VillageSelector.tsx`

A fully functional autocomplete dropdown for village selection.

**Features**:
- Real-time search filtering
- Shows village name, population, and ward count
- Visual highlight for selected village
- Click outside to close

**Usage**:
```tsx
<VillageSelector
  villages={villagesData}
  selectedVillageId={selectedVillageId}
  onSelect={(villageId) => setSelectedVillageId(villageId)}
  placeholder="गाँव चुनें..."
/>
```

### 2. PradhanCard Component
**Location**: `src/components/PradhanCard.tsx`

Displays Pradhan information, contact details, and population statistics.

**Features**:
- Shows Sarpanch name and contact information
- Population data visualization (total, males, females)
- Data source attribution (API or Local)
- Loading state with skeleton
- Responsive grid layout

**Usage**:
```tsx
<PradhanCard
  pradhan={pradhan}
  population={population}
  loading={loading}
/>
```

## API Services

### 1. Pradhan Service
**Location**: `src/services/pradhanService.ts`

**Functions**:
- `fetchPradhanData(villageId, villageName)` - Fetch single Pradhan
- `fetchPradhanDataBatch(villages)` - Batch fetch for multiple villages

**API Sources** (Priority):
1. data.gov.in LGD API (Government)
2. localbodydata.com (Third-party)
3. Local fallback data

**Response**:
```typescript
{
  villageId: number;
  name: string;
  phone?: string;
  email?: string;
  tenure?: { startYear?: number; endYear?: number };
  party?: string;
  photo?: string;
  source: 'api' | 'local';
}
```

### 2. Population Service
**Location**: `src/services/populationService.ts`

**Functions**:
- `fetchPopulationData(villageId, villageName)` - Fetch single village population
- `fetchPopulationBatch(villages)` - Batch fetch
- `calculateStats(populations)` - Calculate statistics

**API Sources** (Priority):
1. data.gov.in Census 2011 API
2. World Bank Open Data API
3. Local Census 2011 fallback data

**Response**:
```typescript
{
  villageId: number;
  population: number;
  year: number;
  males: number;
  females: number;
  source: 'world-bank' | 'census-2011' | 'local';
}
```

## Custom Hooks

### 1. usePradhanData Hook
**Location**: `src/hooks/usePradhanData.ts`

Manages Pradhan data fetching with loading and error states.

```tsx
const { pradhan, loading, error } = usePradhanData(villageId, villageName);
```

**Returns**:
- `pradhan`: PradhanData or null
- `loading`: boolean
- `error`: string or null

### 2. usePopulationData Hook
**Location**: `src/hooks/usePopulationData.ts`

Manages population data fetching.

```tsx
const { population, loading, error } = usePopulationData(villageId, villageName);
```

**Returns**:
- `population`: PopulationData or null
- `loading`: boolean
- `error`: string or null

## Utility Functions

### Village Filters
**Location**: `src/utils/villageFilters.ts`

**Functions**:
- `filterNewsByVillage(news, villageId)` - Filter news by village
- `filterComplaintsByVillage(complaints, villageId)` - Filter complaints
- `filterSchemesByVillage(schemes, villageId)` - Filter schemes
- `filterNoticesByVillage(notices, villageId)` - Filter notices
- `getVillageContent(villageId, news, complaints, notices)` - Get all content

**Usage**:
```tsx
const villageNews = filterNewsByVillage(newsData, selectedVillageId);
const villageComplaints = filterComplaintsByVillage(complaintData, selectedVillageId);
```

## Updated Pages

### VillagesPage
- Added dropdown village selector with search
- Displays Pradhan info and population data for selected village
- Real-time API fetching with fallback

### VillageDetailPage
- Shows detailed Pradhan information
- Displays population statistics
- Links to village-specific news, complaints, and notices

## Data Persistence

### Fallback Data Structure
All services include local fallback data:

**Pradhan Fallback**:
- 10 gram panchayats with Sarpanch names and phone numbers
- Automatically used if APIs fail

**Population Fallback**:
- Census 2011 data for all villages
- Includes male/female breakdown
- Never fails to load

## Error Handling

1. **API Timeouts**: 5-second timeout per API attempt
2. **Sequential Fallbacks**: Tries multiple APIs before local data
3. **User Feedback**: Shows info/warning messages if data source is not real-time
4. **Graceful Degradation**: Always shows some data, never blank

## Performance Optimization

1. **Batching**: Use `fetchPradhanDataBatch()` for multiple villages
2. **Caching**: React hooks memoize data between renders
3. **Lazy Loading**: Data fetched only when village is selected
4. **Timeout Management**: Non-blocking API calls with 5s timeout

## Integration with Existing Features

### Village-Wise News Filtering
When user selects a village in VillagesPage, show only that village's news:
```tsx
import { filterNewsByVillage } from '../utils/villageFilters';
const villageNews = filterNewsByVillage(newsData, selectedVillageId);
```

### Village-Wise Complaints
Similarly, filter complaints by village:
```tsx
const villageComplaints = filterComplaintsByVillage(complaintData, selectedVillageId);
```

## API Rate Limits

- data.gov.in: 600 requests/hour
- World Bank: 120 requests/minute
- localbodydata.com: No documented limit
- Local fallback: Unlimited

## Testing Recommendations

1. **Test with network offline**: Verify fallback data displays correctly
2. **Test with slow network**: Verify timeout handling (5 seconds)
3. **Test with multiple villages**: Verify batch operations work
4. **Test data freshness**: Check API vs local data comparison

## Future Enhancements

1. **Caching Layer**: Implement localStorage/IndexedDB caching
2. **Real-time Updates**: Set up WebSocket for live Pradhan changes
3. **Photo Support**: Add Sarpanch photo display
4. **Email Integration**: Send to Pradhan directly from app
5. **Feedback System**: User can report incorrect data
6. **Admin Dashboard**: Interface to update fallback data

## Files Structure

```
src/
├── components/
│   ├── VillageSelector.tsx
│   └── PradhanCard.tsx
├── services/
│   ├── pradhanService.ts
│   └── populationService.ts
├── hooks/
│   ├── usePradhanData.ts
│   └── usePopulationData.ts
├── utils/
│   └── villageFilters.ts
├── pages/
│   ├── VillagesPage.tsx (updated)
│   └── VillageDetailPage.tsx (updated)
└── data/
    └── pindraVillages.ts (104 villages)
```

## Troubleshooting

### Issue: API data not loading
**Solution**: Check network tab, verify API endpoints accessible, check 5s timeout

### Issue: Pradhan name showing as "जानकारी उपलब्ध नहीं"
**Solution**: Fallback is being used, API may be down, data will update when API recovers

### Issue: Population showing as 0
**Solution**: Using Census 2011 data, if still 0, add to local fallback data

## Support

For issues or updates needed:
1. Check console logs with `[v0-...]` prefix
2. Review API response in browser DevTools
3. Verify village ID matches between selector and detail page
4. Check fallback data in services files
