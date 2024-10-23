import { useEffect, useState } from "react";
import { DockBar } from "./Dock";
import { getFormattedDate } from "../helper/functions";
import axiosInstance from "../axiosInstance";
import { useToast } from "../hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Profile() {
  const { setTheme } = useTheme();

  const { toast } = useToast();
  const [user, setUser] = useState({});
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);

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

      <Card className="mt-5 w-full max-w-md mx-auto">
        <CardHeader>Theme</CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
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

      <div className="fixed right-0 left-0 md:bottom-5 bottom-5 z-50">
        <DockBar />
      </div>
    </div>
  );
}

export default Profile;
