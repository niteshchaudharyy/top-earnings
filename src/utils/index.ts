import moment from "moment";

export type Earnings = {
  currency: string;
  date: string;
  date_confirmed: number;
  eps: string;
  eps_est: string;
  eps_prior: string;
  eps_surprise: string;
  eps_surprise_percent: string;
  eps_type: string;
  exchange: string;
  id: string;
  importance: number;
  name: string;
  notes: string;
  period: string;
  period_year: number;
  revenue: string;
  revenue_est: string;
  revenue_prior: string;
  revenue_surprise: string;
  revenue_surprise_percent: string;
  revenue_type: string;
  ticker: string;
  time: string;
  updated: number;
};

export type EarningsResult = {
  BMO: Earnings[];
  AMC: Earnings[];
};

export const weekdaysFull = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Categorize based on time
export const categorizeEarningTime = (timeStr: string): "BMO" | "AMC" | "During Market" => {
  const [hour, minute] = timeStr.split(":").map(Number);
  const totalMinutes = hour * 60 + minute;
  if (totalMinutes < 570) return "BMO"; // before 9:30am
  if (totalMinutes > 960) return "AMC"; // after 4:00pm
  return "During Market";
}

// Get all weekdays in the current week (Mon–Fri)
function getCurrentWeekDates(): string[] {
  const startOfWeek = moment().startOf("week").add(1, "day"); // Monday
  return Array.from({ length: 5 }, (_, i) => startOfWeek.clone().add(i, "days").format("YYYY-MM-DD"));
}

// Group and sort earnings by day
export const getTopEarningsForWeek = (data: Earnings[]): Record<string, EarningsResult> => {
  const weekDates = getCurrentWeekDates();
  const result: Record<string, EarningsResult> = {};

  // Initialize structure
  for (const date of weekDates) {
    result[date] = { BMO: [], AMC: [] };
  }

  for (const item of data) {
    if (!weekDates.includes(item.date)) continue;
    const category = categorizeEarningTime(item.time);
    if (category === "BMO") result[item.date].BMO.push(item);
    else if (category === "AMC") result[item.date].AMC.push(item);
  }

  // Sort by revenue_est
  for (const date of weekDates) {
    result[date].BMO = result[date].BMO.sort((a, b) => parseFloat(b.revenue_est || "0") - parseFloat(a.revenue_est || "0")).slice(0, 10);
    result[date].AMC = result[date].AMC.sort((a, b) => parseFloat(b.revenue_est || "0") - parseFloat(a.revenue_est || "0")).slice(0, 10);
  }

  return result;
}
