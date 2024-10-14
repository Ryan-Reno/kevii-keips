import { DockBar } from "./Dock";

function BookingsHistory() {
  return (
    <div>
      <h1>Bookings History</h1>
      {/* TODO: Do history page, past and upcoming using tabs */}

      <div className="absolute right-0 left-0 bottom-5">
        <DockBar />
      </div>
    </div>
  );
}

export default BookingsHistory;
