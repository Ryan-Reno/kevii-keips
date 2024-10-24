import { useEffect, useState } from "react";
import { DockBar } from "./Dock";
import { capitalizeFirstLetter, getFormattedDate } from "../helper/functions";
import axiosInstance from "../axiosInstance";
import { useToast } from "../hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Moon, Sun, LogOut, SunMoon, AlertTriangle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DemeritPointsDisplay from "./DemeritPointsDisplay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Profile() {
  const { setTheme } = useTheme();
  const theme = localStorage.getItem("kevii-gym-booking-ui-theme");

  const { toast } = useToast();
  const [user, setUser] = useState({});
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);
  const [demeritPoints, setDemeritPoints] = useState({});
  const [isFetchingDemeritPoints, setIsFetchingDemeritPoints] = useState(false);

  useEffect(() => {
    setIsFetchingStatus(true);
    axiosInstance
      .get("/api/auth/me")
      .then((response) => {
        setUser(response.data);
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

  useEffect(() => {
    setIsFetchingDemeritPoints(true);
    axiosInstance
      .get("/api/demerit/my-demerits")
      .then((response) => {
        setDemeritPoints(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch demerit points",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsFetchingDemeritPoints(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const handleLogout = () => {
    localStorage.removeItem("kevii-gym-token");
    window.location.href = "/login";
  };

  return (
    <div className="md:py-5 md:px-7 py-5 px-4">
      <div className="flex items-center justify-center md:mb-5 mb-5 flex-col">
        <h1 className="text-2xl font-bold text-primary">Profile</h1>
        <h1 className="text-md font-bold text-muted-foreground">
          {getFormattedDate()}
        </h1>
      </div>
      <main className="mb-20">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="flex flex-col items-center space-y-4">
            {isFetchingStatus ? (
              <Skeleton className="w-20 h-20 rounded-full" />
            ) : (
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-lg">
                  {getInitials(user.name || "")}
                </AvatarFallback>
              </Avatar>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isFetchingStatus ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-lg font-medium">{user.email}</p>
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <DemeritPointsDisplay
          demeritPoints={demeritPoints}
          isLoading={isFetchingDemeritPoints}
        />

        <Card className="mt-5 w-full max-w-md mx-auto">
          <CardHeader>Theme</CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex gap-3"
                  size="icon"
                >
                  {theme === "light" ? (
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                  ) : theme === "dark" ? (
                    <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                  ) : (
                    <SunMoon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                  <p className="text-primary text-md">
                    {capitalizeFirstLetter(theme)}
                  </p>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        <Card className="mt-5 w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Gym Rules & Demerit System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="font-semibold text-md pb-1">All Systems:</h2>
              <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                <li>
                  Max users in the gym: <span className="font-bold">5</span>
                </li>
                <li>
                  Max duration per session:{" "}
                  <span className="font-bold">3 hours</span>
                </li>
                <li>
                  Max booking slots per day:{" "}
                  <span className="font-bold">3</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-md pb-1">Demerit System:</h2>
              <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                <li>
                  5 points - Suspension:{" "}
                  <span className="font-bold">7 days</span>
                </li>
                <li>
                  10 points - Suspension:{" "}
                  <span className="font-bold">14 days</span>
                </li>
                <li>
                  15 points - Suspension:{" "}
                  <span className="font-bold">30 days</span>
                </li>
                <li>
                  Max demerit points before ban:{" "}
                  <span className="font-bold">20 points</span>
                </li>
              </ul>
            </div>

            {/* Alert about suspension */}
            <Alert variant="caution">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important:</AlertTitle>
              <AlertDescription>
                Accumulating 20 demerit points will result in a permanent ban
                from the gym.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="mt-5 w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              KEVII Gym Booking App Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <p>This app was created by:</p>
              <ul className="list-disc list-inside pl-4">
                <li>
                  <a
                    href="https://www.linkedin.com/in/brians-tjipto-a25850153/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline-offset-2 underline transition-all ease-in-out duration-200"
                  >
                    Brians Tjipto
                  </a>
                </li>
                <li>Lutfir</li>
                <li>Travis</li>
              </ul>

              <p className="mt-2">
                Made for <span className="font-semibold">KEVII</span> to
                simplify gym bookings and management.
              </p>

              <p className="mt-4">
                Copyright &copy; 2024 Brians Tjipto. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <div className="fixed right-0 left-0 md:bottom-5 bottom-5 z-50">
        <DockBar />
      </div>
    </div>
  );
}

export default Profile;
