import { CalendarArrowDown, Clock, HomeIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dock, DockIcon } from "@/components/ui/dock";

const DATA = {
  navbar: [
    { href: "/dashboard", icon: HomeIcon, label: "Home" },
    { href: "/checkin", icon: Clock, label: "Checkin" },
    { href: "/book", icon: CalendarArrowDown, label: "Book" },
  ],
  navbar2: [{ href: "/profile", icon: User, label: "Profile" }],
};

export function DockBar() {
  return (
    <div className="z-[100]">
      <TooltipProvider>
        <Dock direction="middle">
          {DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    aria-label={item.label}
                    className={`${
                      window.location.pathname === item.href
                        ? cn(
                            buttonVariants({
                              variant: "secondary",
                              size: "icon",
                            }),
                            "size-12 rounded-full text-primary"
                          )
                        : cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "size-12 rounded-full text-primary"
                          )
                    }`}
                  >
                    <item.icon className="size-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          {DATA?.navbar2 && (
            <Separator orientation="vertical" className="h-full" />
          )}
          {DATA?.navbar2?.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    aria-label={item.label}
                    className={`${
                      window.location.pathname === item.href
                        ? cn(
                            buttonVariants({
                              variant: "secondary",
                              size: "icon",
                            }),
                            "size-12 rounded-full text-primary"
                          )
                        : cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "size-12 rounded-full text-primary"
                          )
                    }`}
                  >
                    <item.icon className="size-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        </Dock>
      </TooltipProvider>
    </div>
  );
}
