export const transformDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
};

export const transformTime = (time: string): string => {
  const [hh, mm] = time.split(':');
  return `${hh}${mm}00`;
};

export function getTimeString(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

export function getRoundedHour(): string {
  const now = new Date();
  const rounded = new Date(now);

  // Si los minutos son 30 o más, subimos una hora exacta
  if (now.getMinutes() >= 30) {
    rounded.setHours(now.getHours() + 1, 0, 0, 0);
  } else {
    rounded.setMinutes(0, 0, 0);
  }

  return rounded.toTimeString().slice(0, 5); // HH:MM
}
