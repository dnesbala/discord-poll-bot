export type Holiday = {
  date: string;
  name: string;
};

const holidays: Holiday[] = [
  { date: "2025-01-01", name: "English New Year's Day" },
  { date: "2025-03-13", name: "Holi" },
  { date: "2025-05-01", name: "Labours Day" },
];

export function checkHoliday(): Holiday | undefined {
  const today = new Date().toISOString().split("T")[0];
  return holidays.find((holiday) => holiday.date === today);
}
