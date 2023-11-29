type CalendarColumnHeaderProps = {
  dateName: string;
  dateValue: string;
};

export default function CalendarColumnHeader({
  dateName,
  dateValue,
}: CalendarColumnHeaderProps) {
  return (
    <>
      <span className="day-header-name">{dateName}</span>
      <span className="day-header-value">{dateValue}</span>
    </>
  );
}
