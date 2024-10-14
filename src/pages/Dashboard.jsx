import { DockBar } from "./Dock";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* TODO: idk what is this page for */}

      <div className="absolute right-0 left-0 bottom-5">
        <DockBar />
      </div>
    </div>
  );
}

export default Dashboard;
