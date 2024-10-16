import { DockBar } from "./Dock";
import { getFormattedDate } from "../helper/functions";

function Dashboard() {
  return (
    <div className="md:py-5 md:px-7 py-5 px-4">
      {/* //TODO1: ADD POPULATIONS */}
      {/* //TODO2: ADD EDIT BOOKINGS */}
      {/* //TODO3: ADD DELETE BOOKINGS */}

      <div className="flex items-center justify-center md:mb-3 mb-3 flex-col">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <h1 className="text-md font-bold text-muted-foreground">
          {getFormattedDate()}
        </h1>
      </div>

      <div className="fixed right-0 left-0 md:bottom-5 bottom-5">
        <DockBar />
      </div>
    </div>
  );
}

export default Dashboard;
