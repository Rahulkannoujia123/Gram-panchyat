export const APP_NAME = "पिण्डरा विधानसभा";
export const APP_SUBTITLE = "आपका विधानसभा, आपकी प्रगति";

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const BREAKPOINTS = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
};

export const Z_INDEX = {
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 400,
  tooltip: 500,
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const COMPLAINT_STATUS = {
  OPEN: 'खुली',
  IN_PROGRESS: 'प्रगति में',
  RESOLVED: 'समाधान',
} as const;

export const POLL_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
} as const;

export const DEBOUNCE_DELAY = 300;
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const PAGES = {
  HOME: 'home',
  NEWS: 'news',
  COMPLAINTS: 'complaints',
  SCHEMES: 'schemes',
  MEMBERS: 'members',
  EMERGENCY: 'emergency',
  POLLS: 'polls',
  NOTICES: 'notices',
  NOTIFICATIONS: 'notifications',
  PROFILE: 'profile',
} as const;
