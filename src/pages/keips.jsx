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

  const parseCCAs = (ccaString) => {
    if (!ccaString) return [];
    return ccaString
      .split("|")
      .filter((item) => item.trim() !== "")
      .map((item) => {
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


  const parseRPBreakdown = (rpBreakdown) => {
    const cappedRP = [];
    const uncappedRP = [];
    let isCapped = false;
  
    if (!rpBreakdown) return { cappedRP, uncappedRP };
  
    // Remove leading and trailing spaces and split into individual items
    const items = rpBreakdown.split("|");
  
    items.forEach((item) => {
      item = item.trim();
  
      if (item.startsWith("capped:")) {
        isCapped = true; // Start reading capped events
        item = item.replace("capped:", "").trim();
      } else if (item.startsWith("uncapped:")) {
        isCapped = false; // Switch to uncapped events
        item = item.replace("uncapped:", "").trim();
      }
  
      if (item) {
        const parts = item.split("+");
  
        if (isCapped && parts.length === 2) {
          // Store capped event (format: Event+Points)
          cappedRP.push({ event: parts[0], points: Number(parts[1]) });
        } else if (!isCapped && parts.length === 3) {
          // Store uncapped event (format: CCA+Role+Points)
          uncappedRP.push({ cca: parts[0], role: parts[1], points: Number(parts[2]) });
        }
      }
    });

    uncappedRP.sort((a, b) => b.points - a.points);
  
    return { cappedRP, uncappedRP };
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

const { cappedRP, uncappedRP } = parseRPBreakdown(student.rpBreakdown);

const startingPoints = semester === 0 ? -22 : semester === 1 || semester === 2 ? 0 : -22;

const totalCappedRP = Math.min(cappedRP.reduce((sum, item) => sum + item.points, startingPoints),22);
  const osaCCAs = parseCCAs(student.osaCCAs).sort((a, b) => Number(b.total) - Number(a.total));
  const allOtherCCAs = parseCCAs(student.allOtherCCAs).sort((a, b) => Number(b.total) - Number(a.total));
  const handleLogout = () => {
    localStorage.removeItem("kevii-gym-token");
    window.location.href = "/login";
  };

  return (
    <div className="bg-white text-black min-h-screen container py-8 px-4">
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
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
                    CCA
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
                    Tier
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
                    Attendance
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
                    Performance
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
                    Multiplier
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
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
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.name}
                    </TableCell>
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.tier}
                    </TableCell>
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.attendance}
                    </TableCell>
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.performance}
                    </TableCell>
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.multiplier}
                    </TableCell>
                    <TableCell className="text-base md:text-lg !p-2">
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
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
                    CCA
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
                    Tier
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
                    Attendance
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
                    Performance
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
                    Multiplier
                  </TableHead>
                  <TableHead className="text-base md:text-lg font-medium text-gray-700 !p-2">
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
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.name}
                    </TableCell>
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.tier}
                    </TableCell>
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.attendance}
                    </TableCell>
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.performance}
                    </TableCell>
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.multiplier}
                    </TableCell>
                    <TableCell className="text-base md:text-lg !p-2">
                      {cca.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Table 3: Bonus Points (Uncapped RP) */}
        <div>
          <h1 className="text-center text-xl md:text-2xl font-medium my-4">Bonus Points</h1>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-white">
                <TableHead>CCA</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uncappedRP.map((entry, index) => (
                <TableRow key={`uncapped-${index}`} className={index % 2 === 0 ? "bg-slate-200" : "bg-white"}>
                  <TableCell>{entry.cca}</TableCell>
                  <TableCell>{entry.role}</TableCell>
                  <TableCell>{entry.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Table 4: OSA RP and OSA Points */}
        <div>
          <h1 className="text-center text-xl md:text-2xl font-medium my-4">RP and OSA RP</h1>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-white">
                <TableHead>RP</TableHead>
                <TableHead>OSA RP (Bonus points + RP)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-slate-200">
                <TableCell>{totalCappedRP}</TableCell>
                <TableCell>{student.osaRP}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>


        {/* Contrasting, OSA Points, Percentile */}
        <div>
          <h1 className="text-center text-xl md:text-2xl font-medium my-4">Total points</h1>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-white">
                <TableHead>Contrasting CCA</TableHead>
                <TableHead>OSA Points</TableHead>
                <TableHead>Percentile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-slate-200">
                <TableCell>{student.Contrasting}</TableCell>
                <TableCell>{student.osaPoints}</TableCell>
                <TableCell>{student.Percentile}%</TableCell>
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
              There is a sector CAP of <span className="font-bold">45 points</span>, which may cause the summation of CCAs and OSA RP to not equal total OSA points.
            </li>
            <li>
              For hallplay and Chinese Drama, if you are in more than 1 department that is<span className="font-bold"> NOT</span> cast, your total points is capped at 26.
            </li>
            <li>
              You need to at least have a non-negative RP and have a contrasting CCA (denoted by Y if you do, and N if you do not) to stay next year. If you do not fulfill this requirement, you will have to masterlist
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
