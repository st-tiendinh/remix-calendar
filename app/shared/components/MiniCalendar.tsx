import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import type { EventData } from '../utils/types.server';
import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({}) => {
  return null;
};

export default function MiniCalendar() {
  const { eventsByMonth } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const [currentDateValue, setCurrentDateValue] = useState<Date>();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.get('filter')) {
      setCurrentDateValue(getDateParams());
    }
  }, [params]);

  const handleChangeDate = (date: Date, filterType: string) => {
    navigate(
      `/events?filter=${filterType}&day=${date.getDate()}&month=${
        date.getMonth() + 1
      }&year=${date.getFullYear()}`
    );
  };

  const isDateExists = (inputDate: Date, events: EventData[]) => {
    const inputDateUTC = new Date(
      inputDate.getTime() - inputDate.getTimezoneOffset() * 60000
    );
    const formattedInputDate = inputDateUTC.toISOString().split('T')[0];
    const found = events?.some((item) => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate === formattedInputDate;
    });
    return found;
  };

  const getDateParams = () => {
    const day = params.get('day') ? params.get('day') : new Date().getDate();
    const month = params.get('month')
      ? params.get('month')
      : new Date().getMonth() + 1;
    const year = params.get('year')
      ? params.get('year')
      : new Date().getFullYear();

    return new Date(`${year}-${month}-${day}`);
  };

  return (
    <div className="mini-calendar">
      <Calendar
        value={currentDateValue}
        tileClassName={({ date }) => {
          return isDateExists(date, eventsByMonth) ? 'active' : '';
        }}
        onChange={(value: any) => handleChangeDate(value, 'day')}
        onClickMonth={(value) => handleChangeDate(value, 'month')}
      />
    </div>
  );
}
