export default function ShowEventDetail({ event }: any) {
  console.log('haha', event);
  // const [event, setEvent] = useState();
  // useEffect(() => {
  //   fetch(`/events/${eventId}`)
  //     .then((res) => res.json())
  //     .then((data) => console.log(data));
  //   // .then((data) => setEvent(data));
  // }, [eventId]);

  // console.log('modal',event);

  const handleCopy = () => {
    let copyText =
      document.querySelector<HTMLInputElement>('.event-detail-link');

    if (copyText) {
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(copyText.value);
      let tooltip = document.querySelector<HTMLElement>('#myTooltip');
      if (tooltip) {
        tooltip.innerHTML = 'Copied ' + copyText.value;
      }
    }
  };

  const handleMouseDown = () => {
    let tooltip = document.querySelector<HTMLElement>('myTooltip');
    if (tooltip) {
      tooltip.innerHTML = 'Copy to clipboard';
    }
  };
  return (
    <div className="modal-event-wrapper">
      <div className="event-detail-wrapper">
        <ul className="event-info-list">
          <li className="event-info-item">
            <div className="event-detail">
              <span className="event-detail-icon align-items-center">
                <i className="icon icon-active"></i>
              </span>
              <div className="event-detail-info">
                <h4 className="event-detail-title">{event.title}</h4>
              </div>
            </div>
            <div className="event-detail-date-wrapper">
              <div className="event-detail-date">{event.date}</div>
              <div className="event-detail-time">
                <span className="event-detail-timestamp">
                  {event.timeStart}
                </span>
                -<span className="event-detail-timestamp">{event.timeEnd}</span>
              </div>
            </div>
          </li>

          <li className="event-info-item">
            <div className="event-detail">
              <span className="event-detail-icon align-items-center">
                <i className="icon icon-meeting-link"></i>
              </span>
              <div className="event-detail-info d-flex align-items-center">
                <input
                  type="text"
                  className="event-detail-link"
                  value={'http://localhost:3000'}
                  onChange={() => {}}
                />
              </div>
              <div className="tooltip">
                <button
                  className="btn btn-copy"
                  onClick={handleCopy}
                  onMouseDown={handleMouseDown}
                >
                  <span className="tooltiptext" id="myTooltip">
                    Copy to clipboard
                  </span>
                  <i className="icon icon-copy"></i>
                </button>
              </div>
            </div>
          </li>

          <li className="event-info-item">
            <div className="event-detail">
              <span className="event-detail-icon">
                <i className="icon icon-desc"></i>
              </span>
              <div className="event-detail-info">
                <p className="event-detail-desc">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Maxime, asperiores?
                </p>
              </div>
            </div>
          </li>

          <li className="event-info-item">
            <div className="event-detail">
              <span className="event-detail-icon">
                <i className="icon icon-room"></i>
              </span>
              <div className="event-detail-info">
                <p className="event-detail-location">Mars</p>
              </div>
            </div>
          </li>

          <li className="event-info-item">
            <div className="event-detail">
              <span className="event-detail-icon">
                <i className="icon icon-user"></i>
              </span>
              <div className="event-detail-info">
                <span className="event-detail-desc">Tien Dinh N.</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
