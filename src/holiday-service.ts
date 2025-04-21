export type Holiday = {
  date: string;
  name: string;
};

const holidays: Holiday[] = [
  { date: "2025-01-01", name: "English New Year's Day" },
  { date: "2025-03-13", name: "Holi" },
  { date: "2025-05-01", name: "Labours Day" },
  { date: "2025-05-12", name: "Chandi Purnima, Buddha Jayanti" },
  { date: "2025-10-01", name: "Dashain Maha Navami" },
  { date: "2025-10-02", name: "Dashain Tika" },
  { date: "2025-10-03", name: "Dashain Ekadashi" },
  { date: "2025-10-20", name: "Tihar Laxmi Puja" },
  { date: "2025-10-22", name: "Mha: Puja" },
  { date: "2025-10-20", name: "Bhai Tika" },
  { date: "2025-10-27", name: "Chath" },
  { date: "2025-12-25", name: "Christmas" },
  { date: "2026-01-01", name: "English New Year's Day" },
  { date: "2025-03-02", name: "Holi" },
];

export function checkHoliday(): Holiday | undefined {
  const today = new Date().toISOString().split("T")[0];
  return holidays.find((holiday) => holiday.date === today);
}
