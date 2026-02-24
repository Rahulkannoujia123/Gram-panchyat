import { Complaint } from '../types';
import { complaintsData } from '../data';

const COMPLAINTS_STORAGE_KEY = 'pindra_complaints';

// In a real app, these would be fetch calls to a backend
export const complaintService = {
  getComplaints: async (villageId?: number): Promise<Complaint[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const localData = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    const userComplaints: Complaint[] = localData ? JSON.parse(localData) : [];

    // Combine base mock data with user-submitted data
    const allComplaints = [...userComplaints, ...complaintsData];

    if (villageId) {
      // Logic for filtering by village ID if applicable
      // For now we use the mock village name matching
      return allComplaints;
    }

    return allComplaints;
  },

  submitComplaint: async (complaint: Partial<Complaint>): Promise<Complaint> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const trackingId = `CMP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newComplaint: Complaint = {
      id: Date.now(),
      trackingId,
      title: complaint.title || '',
      description: complaint.description || '',
      date: new Date().toLocaleDateString('hi-IN'),
      time: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
      userName: complaint.userName || 'Anonymous',
      village: complaint.village as any,
      status: 'pending',
      category: complaint.category || 'अन्य',
      votes: 0,
    };

    const localData = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    const userComplaints: Complaint[] = localData ? JSON.parse(localData) : [];
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify([newComplaint, ...userComplaints]));

    return newComplaint;
  },

  getComplaintStatus: async (trackingId: string): Promise<Complaint | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const localData = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    const userComplaints: Complaint[] = localData ? JSON.parse(localData) : [];
    const allComplaints = [...userComplaints, ...complaintsData];

    return allComplaints.find(c => c.trackingId === trackingId) || null;
  }
};
