import { DockBar } from "./Dock";

function BookingsHistory() {
  return (
    <div>
      <h1>Bookings History</h1>
      {/* TODO: Do history page, past and upcoming using tabs */}

      <div className="fixed right-0 left-0 md:bottom-5 bottom-10">
        <DockBar />
      </div>
    </div>
  );
}

export default BookingsHistory;
