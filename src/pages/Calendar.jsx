import { DockBar } from "./Dock";

function Calendar() {
  return (
    <div>
      <h1>Calendar</h1>
      {/* TODO: Do calendar page, see the weekly bookings */}

      <div className="fixed right-0 left-0 md:bottom-5 bottom-10">
        <DockBar />
      </div>
    </div>
  );
}

export default Calendar;
