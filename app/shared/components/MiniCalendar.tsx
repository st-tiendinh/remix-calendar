import { useNavigate } from '@remix-run/react';
import Calendar from 'react-calendar';

export default function MiniCalendar() {
  const navigate = useNavigate();
  const handleChangeDate = (date: Date, filterType: string) => {
    navigate(
      `/events?filter=${filterType}&day=${date.getDate()}&month=${
        date.getMonth() + 1
      }&year=${date.getFullYear()}`
    );
  };
  return (
    <div className="mini-calendar">
      <Calendar
        onChange={(value: any) => handleChangeDate(value, 'day')}
        onClickMonth={(value) => handleChangeDate(value, 'month')}
      />
    </div>
  );
}
