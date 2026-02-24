import { NewsItem, Complaint, Scheme, Notice, VillageNews, VillageComplaint, VillageNotice } from '../types';

/**
 * Filter news items by village
 */
export function filterNewsByVillage(news: NewsItem[], villageId: number | undefined): NewsItem[] {
  if (!villageId) return news;
  
  return news.filter((item) => {
    // Check if item has villageId property
    const villageNews = item as unknown as VillageNews;
    return villageNews.villageId === villageId;
  });
}

/**
 * Filter complaints by village
 */
export function filterComplaintsByVillage(complaints: Complaint[], villageId: number | undefined): Complaint[] {
  if (!villageId) return complaints;
  
  return complaints.filter((item) => {
    const villageComplaint = item as unknown as VillageComplaint;
    return villageComplaint.villageId === villageId;
  });
}

/**
 * Filter schemes by village
 */
export function filterSchemesByVillage(schemes: Scheme[], villageId: number | undefined): Scheme[] {
  if (!villageId) return schemes;
  
  // Schemes are typically not village-specific, but keep for consistency
  return schemes;
}

/**
 * Filter notices by village
 */
export function filterNoticesByVillage(notices: Notice[], villageId: number | undefined): Notice[] {
  if (!villageId) return notices;
  
  return notices.filter((item) => {
    const villageNotice = item as unknown as VillageNotice;
    return villageNotice.villageId === villageId;
  });
}

/**
 * Get all village-specific content
 */
export function getVillageContent(
  villageId: number,
  allNews: NewsItem[],
  allComplaints: Complaint[],
  allNotices: Notice[]
) {
  return {
    news: filterNewsByVillage(allNews, villageId),
    complaints: filterComplaintsByVillage(allComplaints, villageId),
    notices: filterNoticesByVillage(allNotices, villageId),
  };
}
