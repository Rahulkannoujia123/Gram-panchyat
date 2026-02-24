import { Scheme } from '../types';
import { schemesData } from '../data';

// Official Indian Government Schemes API endpoints (Hypothetical or Public if available)
// Note: Real APIs like data.gov.in require API keys and usually have CORS restrictions for client-side only
// So we structure this to handle external data correctly.

export const schemeService = {
  getSchemes: async (category?: string): Promise<Scheme[]> => {
    // Simulate fetching from an external source like MyScheme
    await new Promise(resolve => setTimeout(resolve, 600));

    let filtered = [...schemesData];
    if (category && category !== 'सभी') {
      filtered = filtered.filter(s => s.category === category);
    }

    return filtered;
  },

  getExternalSchemeDetails: (_schemeId: number) => {
    // In a real world, this would link to something like:
    // https://www.myscheme.gov.in/schemes/<scheme-slug>
    return `https://www.myscheme.gov.in/`;
  }
};
