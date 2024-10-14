import {
  CalendarArrowDown,
  CalendarIcon,
  History,
  HomeIcon,
} from "lucide-react";
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
    { href: "/book", icon: CalendarArrowDown, label: "Book" },
  ],
  navbar2: [
    { href: "/calendar", icon: CalendarIcon, label: "Calendar" },
    { href: "/bookings", icon: History, label: "Bookings" },
  ],
};

export function DockBar() {
  return (
    <div>
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
                            "size-12 rounded-full"
                          )
                        : cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "size-12 rounded-full"
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
          <Separator orientation="vertical" className="h-full" />
          {DATA.navbar2.map((item) => (
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
                            "size-12 rounded-full"
                          )
                        : cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "size-12 rounded-full"
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
