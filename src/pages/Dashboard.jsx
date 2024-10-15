import { DockBar } from "./Dock";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* TODO: idk what is this page for */}

      <div className="fixed right-0 left-0 md:bottom-5 bottom-10">
          <DockBar />
        </div>
    </div>
  );
}

export default Dashboard;
