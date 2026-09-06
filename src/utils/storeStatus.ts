/**
 * Authoritative Store Status & Live Countdown Engine
 * 
 * Operating Schedule:
 * EVERY THURSDAY 17:00 → 01:00 (Friday 01:00 early morning after midnight).
 * 
 * Status Logic:
 * - Thursday 17:00 to Friday 01:00 = OPEN
 * - Friday 01:00 onward = CLOSED
 * - Friday through Wednesday = CLOSED
 * - Thursday before 17:00 = CLOSED
 * - Thursday at/after 17:00 = OPEN
 */

export interface StoreCountdown {
  isOpen: boolean;
  totalSeconds: number;
  totalHours: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedTimer: string;
  hhmmss: string;
  targetDate: Date;
  statusHeadline: {
    he: string;
    en: string;
  };
  countdownLabel: {
    he: string;
    en: string;
  };
}

export function getStoreStatus(now: Date = new Date()): StoreCountdown {
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 4 = Thursday, 5 = Friday, 6 = Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  let isOpen = false;
  let targetDate: Date;

  // Check if OPEN:
  // Case A: Thursday from 17:00:00 to 23:59:59
  if (day === 4 && hours >= 17) {
    isOpen = true;
    // Closes Friday at 01:00:00
    targetDate = new Date(now);
    targetDate.setDate(now.getDate() + 1);
    targetDate.setHours(1, 0, 0, 0);
  }
  // Case B: Friday from 00:00:00 to 00:59:59 (before 01:00:00)
  else if (day === 5 && hours === 0) {
    isOpen = true;
    // Closes today (Friday) at 01:00:00
    targetDate = new Date(now);
    targetDate.setHours(1, 0, 0, 0);
  }
  // Otherwise: CLOSED
  else {
    isOpen = false;
    // Calculate next Thursday 17:00:00
    let daysUntilThursday = (4 - day + 7) % 7;
    
    if (day === 4) {
      // Thursday before 17:00
      if (hours < 17) {
        daysUntilThursday = 0; // Today at 17:00
      } else {
        // Thursday after 17:00 (this is caught by isOpen, but safe fallback)
        daysUntilThursday = 7;
      }
    } else if (day === 5 && hours >= 1) {
      // Friday after 01:00
      daysUntilThursday = 6;
    }

    targetDate = new Date(now);
    targetDate.setDate(now.getDate() + daysUntilThursday);
    targetDate.setHours(17, 0, 0, 0);
  }

  const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);

  const totalHours = Math.floor(totalSeconds / 3600);
  const days = Math.floor(totalSeconds / 86400);
  const remSeconds = totalSeconds % 86400;
  const remHours = Math.floor(remSeconds / 3600);
  const remMinutes = Math.floor((remSeconds % 3600) / 60);
  const remSecs = remSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Format HH:MM:SS (strictly matching prompt example e.g. "02 : 41 : 36" or total hours)
  const hhmmss = `${pad(totalHours)}:${pad(remMinutes)}:${pad(remSecs)}`;
  const timePart = `${pad(remHours)}:${pad(remMinutes)}:${pad(remSecs)}`;
  const formattedTimer = days > 0 ? `${days}d ${timePart}` : timePart;

  return {
    isOpen,
    totalSeconds,
    totalHours,
    days,
    hours: remHours,
    minutes: remMinutes,
    seconds: remSecs,
    formattedTimer,
    hhmmss,
    targetDate,
    statusHeadline: {
      he: isOpen ? 'פתוח' : 'נפתח בעוד',
      en: isOpen ? 'Open Now' : 'Opens in',
    },
    countdownLabel: {
      he: isOpen ? 'נסגר בעוד' : 'נפתח בעוד',
      en: isOpen ? 'Closes in' : 'Opens in',
    },
  };
}
