import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useToast } from "../hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {LogOut} from "lucide-react";

export default function Keips() {
  const [student, setStudent] = useState(null);
  const { toast } = useToast();
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);

  useEffect(() => {
    setIsFetchingStatus(true);
    axiosInstance
      .get("/api/auth/student")
      .then((response) => {
        setStudent(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsFetchingStatus(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to parse CCA strings
  const parseCCAs = (ccaString) => {
    if (!ccaString) return [];
    // Split by '|' and filter out empty strings
    return ccaString
      .split("|")
      .filter((item) => item.trim() !== "")
      .map((item) => {
        // Each item should be in the format:
        // CCA Name-CCA Tier-Attendance point-Performance point-Multiplier-Total point
        const parts = item.split("-");
        return {
          name: parts[0] || "",
          tier: parts[1] || "",
          attendance: parts[2] || "",
          performance: parts[3] || "",
          multiplier: parts[4] || "",
          total: parts[5] || "",
        };
      });
  };

  if (isFetchingStatus) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center text-red-600">
        Error: Student data not found.
      </div>
    );
  }

  const osaCCAs = parseCCAs(student.osaCCAs);
  const allOtherCCAs = parseCCAs(student.allOtherCCAs);
  const handleLogout = () => {
    localStorage.removeItem("kevii-gym-token");
    window.location.href = "/login";
  };

  return (
    <div className="container py-8 px-4">
      <div className="w-full flex justify-end pr-6 pt-4">
        <Button variant="destructive" onClick={handleLogout} className="px-3 py-1 text-sm">
            <LogOut className="mr-1 h-3 w-3" />
            Logout
        </Button>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-12">
        {/* Table 1: OSA CCAs */}
        <div>
          <h1 className="text-center text-xl md:text-2xl font-medium my-4">
            Top 4 CCAs
          </h1>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    CCA
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    Tier
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    Attendance
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    Performance
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    Multiplier
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {osaCCAs.map((cca, index) => (
                  <TableRow
                    key={`osa-${cca.name}-${index}`}
                    className={index % 2 === 0 ? "bg-slate-200" : "bg-white"}
                  >
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.name}
                    </TableCell>
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.tier}
                    </TableCell>
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.attendance}
                    </TableCell>
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.performance}
                    </TableCell>
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.multiplier}
                    </TableCell>
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Table 2: All Other CCAs */}
        <div>
          <h1 className="text-center text-xl md:text-2xl font-medium my-4">
            All Other CCAs
          </h1>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    CCA
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    Tier
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    Attendance
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    Performance
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    Multiplier
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allOtherCCAs.map((cca, index) => (
                  <TableRow
                    key={`all-${cca.name}-${index}`}
                    className={index % 2 === 0 ? "bg-slate-200" : "bg-white"}
                  >
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.name}
                    </TableCell>
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.tier}
                    </TableCell>
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.attendance}
                    </TableCell>
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.performance}
                    </TableCell>
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.multiplier}
                    </TableCell>
                    <TableCell className="text-base md:text-lg p-[6px]">
                      {cca.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Table 3: OSA RP and OSA Points */}
        <div>
          <h1 className="text-center text-xl md:text-2xl font-medium my-4">
            OSA RP and Points
          </h1>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-white">
                <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                  OSA RP
                </TableHead>
                <TableHead className="text-base md:text-lg font-medium text-gray-700 p-[6px]">
                  OSA Points
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-slate-200">
                <TableCell className="text-base md:text-lg p-[6px]">
                  {student.osaRP}
                </TableCell>
                <TableCell className="text-base md:text-lg p-[6px]">
                  {student.osaPoints}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
         {/* Note Section */}
         <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Notes
          </h2>
          <ul className="list-disc list-inside text-base md:text-lg text-gray-700 space-y-2">
            <li>
              There is a sector CAP of <span className="font-bold">45 points</span>, which may cause the summation of CCAs and RP to not equal total OSA points.
            </li>
            <li>
              For hallplay and Chinese Drama, if you are in more than 1 department that is<span className="font-bold"> NOT</span> cast, your total points is capped at 26.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
