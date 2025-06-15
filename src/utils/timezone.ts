import { Timestamp } from 'firebase/firestore';
import moment from 'moment-timezone';

// PST/PDT timezone
const PST_TIMEZONE = 'America/Los_Angeles';

// Get current time in PST using moment-timezone
export const getCurrentPSTTime = (): Date => {
  return moment().tz(PST_TIMEZONE).toDate();
};

// Convert Firebase Timestamp to PST
export const timestampToPST = (timestamp: Timestamp): Date => {
  const utcDate = timestamp.toDate();
  return moment(utcDate).tz(PST_TIMEZONE).toDate();
};

// Create Firebase Timestamp (stored as UTC in Firebase)
export const createPSTTimestamp = (): Timestamp => {
  return Timestamp.now(); // Firebase stores this as UTC internally
};

// Check if data is stale (more than 1 hour in PST)
export const isDataStalePST = (lastFetchTimestamp: Timestamp): boolean => {
  const now = getCurrentPSTTime();
  const lastFetch = timestampToPST(lastFetchTimestamp);
  const diffMs = now.getTime() - lastFetch.getTime();
  const oneHour = 60 * 60 * 1000;
  
  console.log(`🕐 PST Time Check:
    Current PST: ${formatPSTTime(now)}
    Last Fetch PST: ${formatPSTTime(lastFetch)}
    Diff: ${Math.floor(diffMs / (1000 * 60))} minutes
    Is Stale: ${diffMs > oneHour}`);
  
  return diffMs > oneHour;
};

// Format PST time for display
export const formatPSTTime = (date: Date): string => {
  return moment(date).tz(PST_TIMEZONE).format('MMM DD, YYYY HH:mm:ss z');
};

// Format relative time (X minutes ago) in PST
export const formatRelativeTimePST = (timestamp: Timestamp): string => {
  const now = getCurrentPSTTime();
  const past = timestampToPST(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
};

// Format full timestamp for display
export const formatFullTimestampPST = (timestamp: Timestamp): string => {
  const utcDate = timestamp.toDate();
  return moment(utcDate).tz(PST_TIMEZONE).format('MMMM DD, YYYY [at] h:mm:ss A z');
};