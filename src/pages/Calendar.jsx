import { DockBar } from "./Dock";

function Calendar() {
  return (
    <div>
      <h1>Calendar</h1>
      {/* TODO: Do calendar page, see the weekly bookings */}

      <div className="absolute right-0 left-0 bottom-5">
        <DockBar />
      </div>
    </div>
  );
}

export default Calendar;
