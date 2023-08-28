import { parseISO, format } from 'date-fns';

export const formatDateTime = (dateTimeString) => {
  const date = parseISO(dateTimeString);
  return format(date, 'yyyy-MM-dd | HH:mm');
}