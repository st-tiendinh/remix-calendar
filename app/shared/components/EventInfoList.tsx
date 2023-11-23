type EventDetailProps = {
  event?: any;
};

export default function EventDetail({ event }: EventDetailProps) {
  const handleCopy = () => {
    var copyText =
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
    <div className="event-detail-wrapper">
      <ul className="event-info-list">
        <li className="event-info-item">
          <div className="event-detail">
            <span className="event-detail-icon">
              <i className="icon icon-active"></i>
            </span>
            <div className="event-detail-info">
              <h4 className="event-detail-title">[FE] Weekly meeting</h4>
            </div>
          </div>
          <div className="event-detail-date-wrapper">
            <div className="event-detail-date">Thursday, November 23</div>
            <div className="event-detail-time">
              <span className="event-detail-timestamp">1:45am</span>-
              <span className="event-detail-timestamp">2:30pm</span>
            </div>
          </div>
        </li>

        <li className="event-info-item">
          <div className="event-detail">
            <span className="event-detail-icon">
              <i className="icon icon-meeting-link"></i>
            </span>
            <div className="event-detail-info">
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
  );
}
