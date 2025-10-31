export async function getUpcomingHoliday(country = process.env.COUNTRY_CODE || "NG") {
  const apiKey = process.env.CALENDARIFIC_API_KEY;
  const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${new Date().getFullYear()}`;

  const res = await fetch(url);
  const data = await res.json();

  const holidays = Object.values(data.response.holidays).flat();
  const today = new Date();

  const upcoming = holidays
    .map((h: any) => ({
      name: h.name,
      date: new Date(h.date.iso),
    }))
    .filter((h) => h.date > today)
    .sort((a: any, b: any) => a.date.getTime() - b.date.getTime());

  if (!upcoming.length) throw new Error("No upcoming holidays found");

  const next = upcoming[0];
  const diff = next.date.getTime() - today.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    name: next.name,
    date: next.date.toISOString().split('T')[0],
    daysLeft: days,
  };
}
