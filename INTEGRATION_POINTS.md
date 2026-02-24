# Integration Points - Village Features

## Complete Implementation Map

### 1. Village Selection Flow

```
HomePage
├── Click "गाँव" (Villages Button)
└── Navigate to VillagesPage
    │
    ├── VillageSelector Component
    │   ├── Displays all 104 villages
    │   ├── Search functionality
    │   └── Select village
    │
    ├── usePradhanData Hook (triggered on select)
    │   ├── Calls: fetchPradhanData()
    │   ├── Sources: LGD API → LocalBodyData → Fallback
    │   └── Returns: PradhanData
    │
    ├── usePopulationData Hook (triggered on select)
    │   ├── Calls: fetchPopulationData()
    │   ├── Sources: Census API → World Bank → Fallback
    │   └── Returns: PopulationData
    │
    └── PradhanCard Component
        ├── Displays Sarpanch name
        ├── Shows phone/email links
        ├── Displays population stats
        └── Source attribution
```

### 2. Village Details Navigation

```
VillagesPage (Selected Village)
└── Click on village in list
    │
    └── Navigate to VillageDetailPage
        │
        ├── usePradhanData (auto-fetches)
        ├── usePopulationData (auto-fetches)
        ├── filterNewsByVillage() → Show village news
        ├── filterComplaintsByVillage() → Show village complaints
        └── filterNoticesByVillage() → Show village notices
```

### 3. News/Complaints Filtering

```
NewsPage / ComplaintsPage / NoticesPage
├── User selects village (if available)
└── Apply filter:
    filterNewsByVillage(newsData, villageId)
    │
    └── Returns only items where villageId matches
        └── Display filtered content
```

## Component Integration

### VillageSelector Integration Points

```typescript
// In VillagesPage.tsx
const [selectedVillageId, setSelectedVillageId] = useState<number>();

<VillageSelector
  villages={villagesData}  // From useVillages hook
  selectedVillageId={selectedVillageId}
  onSelect={(villageId) => {
    setSelectedVillageId(villageId);  // Triggers hooks
    // Hooks automatically fetch data
  }}
/>
```

### PradhanCard Integration Points

```typescript
// In VillagesPage.tsx and VillageDetailPage.tsx
const { pradhan } = usePradhanData(selectedVillageId, villageName);
const { population } = usePopulationData(selectedVillageId, villageName);

<PradhanCard
  pradhan={pradhan}
  population={population}
  loading={loading}
/>
```

## Data Flow Paths

### Path 1: Immediate Village Selection
```
User Selects Village → setSelectedVillageId(id)
    ↓
usePradhanData Hook Dependency (id)
    ├── Check cache
    ├── Fetch from API
    └── Set state (renders PradhanCard)
    
usePopulationData Hook Dependency (id)
    ├── Check cache
    ├── Fetch from API
    └── Set state (renders PradhanCard)
```

### Path 2: Village Detail Navigation
```
Click Village Item → onNavigate('village-detail', villageId)
    ↓
VillageDetailPage Mount
    ├── useMemo gets village from villagesData
    ├── usePradhanData(villageId) triggers
    ├── usePopulationData(villageId) triggers
    └── Both hooks fetch and render
```

### Path 3: Content Filtering
```
VillageDetailPage Renders
    ├── useVillages() returns all 104 villages
    ├── filterNewsByVillage(villageNewsData, villageId)
    │   └── Returns only matching village news
    ├── filterComplaintsByVillage(villageComplaintsData, villageId)
    │   └── Returns only matching complaints
    └── filterNoticesByVillage(villageNoticesData, villageId)
        └── Returns only matching notices
```

## API Integration Points

### Pradhan Service Integration

```typescript
// Import in components/pages
import { fetchPradhanData } from '../services/pradhanService';

// Called by usePradhanData hook
const data = await fetchPradhanData(villageId, villageName);

// API Sequence:
fetchPradhanFromLGD()           // Try 1: Government API
    ↓ (if fails)
fetchPradhanFromLocalBodyData() // Try 2: Third-party
    ↓ (if fails)
localPradhanData[villageId]     // Try 3: Fallback
```

### Population Service Integration

```typescript
// Import in components/pages
import { fetchPopulationData } from '../services/populationService';

// Called by usePopulationData hook
const data = await fetchPopulationData(villageId, villageName);

// API Sequence:
fetchFromCensusAPI()    // Try 1: Census 2011 API
    ↓ (if fails)
fetchFromWorldBank()    // Try 2: World Bank API
    ↓ (if fails)
census2011Data          // Try 3: Local Census data
```

## State Management Integration

### App.tsx Updates
```typescript
const [selectedVillageId, setSelectedVillageId] = useState<number | undefined>();

// Passed to pages that need village filtering
<VillagesPage 
  onNavigate={(page, villageId) => {
    setSelectedVillageId(villageId);
    setCurrentPage(page);
  }}
/>

<VillageDetailPage 
  villageId={selectedVillageId}
  onNavigate={(section) => { /* handle */ }}
/>
```

## Hook Integration Points

### useVillages Hook
```typescript
// Already exists, returns:
{
  villages: Village[],    // 104 Pindra villages
  loading: boolean,
  error: string | null,
  refetch: () => void
}
```

### usePradhanData Hook (NEW)
```typescript
// Called with villageId
const { pradhan, loading, error } = usePradhanData(villageId, villageName);

// Manages:
// - API fetching
// - Loading state
// - Error handling
// - Fallback logic
```

### usePopulationData Hook (NEW)
```typescript
// Called with villageId
const { population, loading, error } = usePopulationData(villageId, villageName);

// Manages:
// - API fetching
// - Loading state
// - Error handling
// - Fallback logic
```

## Filter Utility Integration

### In Page Components
```typescript
import { filterNewsByVillage, filterComplaintsByVillage } from '../utils/villageFilters';

// Apply in render
const villageNews = filterNewsByVillage(newsData, selectedVillageId);
const villageComplaints = filterComplaintsByVillage(complaintData, selectedVillageId);

// If no village selected, shows all content
// If village selected, shows only that village's content
```

## Type System Integration

### Village Type
```typescript
interface Village {
  id: number;
  name: string;
  population: number;
  wards: number;
  sarpanch?: string;        // Optional (can be from Pradhan API)
  phone?: string;           // Optional (can be from Pradhan API)
  icon?: string;
  description?: string;
}
```

### PradhanData Type
```typescript
interface PradhanData {
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

### PopulationData Type
```typescript
interface PopulationData {
  villageId: number;
  population: number;
  year: number;
  males: number;
  females: number;
  source: 'world-bank' | 'census-2011' | 'local';
}
```

## Page Integration Summary

### VillagesPage Integration
```
Before: Simple list of villages
After:
  ├── VillageSelector (NEW)
  ├── PradhanCard (NEW)
  ├── usePradhanData hook (NEW)
  ├── usePopulationData hook (NEW)
  └── Search still works + all previous features
```

### VillageDetailPage Integration
```
Before: Village details + news/complaints
After:
  ├── PradhanCard (NEW) - Shows real Sarpanch
  ├── usePradhanData hook (NEW) - Fetches from API
  ├── usePopulationData hook (NEW) - Fetches from API
  ├── Content filtering (via utils)
  └── All previous features intact
```

## API Endpoint Integration

### Tested Endpoints
- ✅ `data.gov.in CKAN API` - Working
- ✅ `localbodydata.com` - Supports queries
- ✅ `World Bank Open Data API` - Available
- ✅ Fallback local data - Always works

### Endpoint Patterns
```
LGD: https://lgdweb.nic.in/api/villages/{villageId}
LocalBody: https://localbodydata.com/api/villages/{villageName}
Census: https://www.data.gov.in/api/3/action/datastore_search?resource_id=...
WorldBank: https://api.worldbank.org/v2/country/IND/indicator/...
```

## Error Handling Integration

### Try-Catch-Fallback Pattern
```
try API 1
    catch → try API 2
        catch → try API 3
            catch → use LOCAL_DATA
                (always succeeds)
```

### User Feedback Integration
```
Loading State → Show spinner
Error with fallback → Show info badge
Success → Display data normally
Source attribution → Show "API" or "Local Data"
```

## Testing Integration Points

### Unit Tests
```
✓ VillageSelector filters correctly
✓ PradhanCard displays properly
✓ usePradhanData fetches correctly
✓ usePopulationData fetches correctly
✓ Filter utilities work as expected
✓ Fallback data loads successfully
```

### Integration Tests
```
✓ Select village → Pradhan loads
✓ Pradhan loads → Population loads
✓ Navigate to detail → Data persists
✓ Filter applies → Content shows correctly
✓ API fails → Fallback shows
```

## Performance Integration

### Optimization Points
```
VillageSelector
  └── useMemo for filtered villages

PradhanCard
  └── React.memo prevents re-renders

Hooks
  ├── useEffect depends on [villageId]
  ├── 5-second timeout prevents hanging
  └── Batch operations for multiple villages
```

## Backward Compatibility

### No Breaking Changes
```
✓ All existing pages work unchanged
✓ All existing components work unchanged
✓ All existing data structures extended (not replaced)
✓ All existing hooks still available
✓ Can be adopted incrementally
```

## Migration Guide (if needed)

### Old Code (Still Works)
```typescript
// Existing village display
<div>{village.name}</div>
<div>{village.population}</div>
```

### New Code (Enhanced)
```typescript
// Enhanced with Pradhan info
<VillageSelector {...props} />
<PradhanCard pradhan={pradhan} population={population} />
```

Both work perfectly. Old code continues as-is, new features available separately.

---

## Complete Integration Checklist

- ✅ VillageSelector component integrated
- ✅ PradhanCard component integrated
- ✅ usePradhanData hook integrated
- ✅ usePopulationData hook integrated
- ✅ pradhanService integrated
- ✅ populationService integrated
- ✅ villageFilters utilities integrated
- ✅ VillagesPage updated
- ✅ VillageDetailPage updated
- ✅ Types updated
- ✅ Data structures enhanced
- ✅ API error handling complete
- ✅ Fallback logic verified
- ✅ Documentation complete
- ✅ No breaking changes
- ✅ Ready for production

**Status**: ✅ **FULLY INTEGRATED AND OPERATIONAL**
