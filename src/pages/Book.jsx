import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { DockBar } from "./Dock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  format,
  parseISO,
  parse,
  addDays,
  isBefore,
  addMinutes,
} from "date-fns";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { BookMarked, Loader2, User } from "lucide-react";
import {
  formatDateTime,
  formatDate,
  convertToISO,
  getFormattedDate,
} from "../helper/functions";
import { useTheme } from "@/components/theme-provider";

const MAX_DAILY_BOOKING = 5;
const BOOKING_START_TIME = "06:00";
const BOOKING_END_TIME = "23:00";
const GRACE_PERIOD_MINUTES = 15;

const times = [
  // "00:00",
  // "00:30",
  // "01:00",
  // "01:30",
  // "02:00",
  // "02:30",
  // "03:00",
  // "03:30",
  // "04:00",
  // "04:30",
  // "05:00",
  // "05:30",
  // "06:00",
  // "06:30",
  // "07:00",
  // "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  // "23:00",
  // "23:30",
];

function Book() {
  const { toast } = useToast();
  const { theme } = useTheme();

  const [data, setData] = useState({});
  const [selectedTime, setSelectedTime] = useState({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(0.5);
  const [weekDates, setWeekDates] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const getThemeAwareColor = (value, isDisabled) => {
    return theme === "dark" || theme === "system"
      ? getColorDark(value, isDisabled)
      : getColor(value, isDisabled);
  };

  useEffect(() => {
    setLoading(true);
    setIsBooking(true);
    const today = format(new Date(), "yyyy-MM-dd");

    axiosInstance
      .get(
        `/api/bookings/week-count?date=${today}&startOfWeek=false&startTime=${BOOKING_START_TIME}&endTime=${BOOKING_END_TIME}&useSpecialUserValue=true`
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description:
            "There was an error, we will try again. This page will reload soon.",
          variant: "destructive",
        });
        console.error(error);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .finally(() => {
        setLoading(false);
        setIsBooking(false);
      });

    const todayDate = new Date();
    if (isNaN(todayDate)) {
      console.error("Invalid date");
    } else {
      const todayDate = new Date();

      const weekDate = Array.from({ length: 7 }).map((_, index) =>
        format(new Date(addDays(todayDate, index)), "EEE, dd MMM")
      );

      setWeekDates(weekDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dates = Object.keys(data);
  const firstDate = dates.length > 0 ? dates[0] : null;
  const timeSlots = firstDate ? Object.keys(data[firstDate] || {}) : [];

  function getColor(value, isDisabled) {
    if (isDisabled) {
      return "bg-gray-300";
    }
    switch (value) {
      case 0:
        return "bg-slate-100";
      case 1:
        return "bg-blue-200";
      case 2:
        return "bg-teal-200";
      case 3:
        return "bg-yellow-200";
      case 4:
        return "bg-orange-300";
      case 5:
        return "bg-red-400";
      case 100:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  }

  function getColorDark(value, isDisabled) {
    if (isDisabled) {
      return "bg-gray-700";
    }
    switch (value) {
      case 0:
        return "bg-neutral-900";
      case 1:
        return "bg-blue-800";
      case 2:
        return "bg-teal-800";
      case 3:
        return "bg-yellow-800";
      case 4:
        return "bg-orange-800";
      case 5:
        return "bg-red-800";
      case 100:
        return "bg-green-800";
      default:
        return "bg-gray-800";
    }
  }

  const legendItems = [
    { value: 0, label: "5 Available" },
    { value: 1, label: "4 Available" },
    { value: 2, label: "3 Available" },
    { value: 3, label: "2 Available" },
    { value: 4, label: "1 Available" },
    { value: 5, label: "Full" },
    { value: 100, label: "Your Booking" },
    { value: true, label: "Disabled" },
  ];

  async function bookSlot() {
    const date = convertToISO(selectedTime);
    const duration = selectedTimeSlot;

    setIsBooking(true);
    axiosInstance
      .post("/api/bookings", {
        date,
        duration,
      })
      .then((response) => {
        if (response.status === 201) {
          toast({
            title: "Booking",
            description: "Booking successful, page will reload soon.",
          });

          setTimeout(() => {
            window.location.reload();
          }, 1000);

          toast({
            title: "Booking",
            description: "Booking successful, page will reload soon.",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Booking Failed",
          description: `${error.response.data.error}`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsBooking(false);
      });
  }

  function getAvailableTimeSlots(date, time) {
    const bookingDateTime = parseISO(`${date}T${time}`);
    const endTime = parse(BOOKING_END_TIME, "HH:mm", bookingDateTime);
    const availableHours =
      (endTime.getTime() - bookingDateTime.getTime()) / (1000 * 60 * 60);

    let userBookingEnd = null;
    for (let i = timeSlots.indexOf(time); i < timeSlots.length; i++) {
      if (data[date][timeSlots[i]] === 100) {
        if (!userBookingEnd) {
          userBookingEnd = timeSlots[i];
        }
      } else if (userBookingEnd) {
        break;
      }
    }

    if (userBookingEnd) {
      const userBookingEndTime = parse(
        userBookingEnd,
        "HH:mm",
        bookingDateTime
      );
      const hoursUntilUserBooking =
        (userBookingEndTime.getTime() - bookingDateTime.getTime()) /
        (1000 * 60 * 60);
      return [0.5, 1, 1.5, 2, 2.5, 3].filter(
        (slot) => slot <= Math.min(availableHours, hoursUntilUserBooking)
      );
    }

    return [0.5, 1, 1.5, 2, 2.5, 3].filter((slot) => slot <= availableHours);
  }

  const isTimeSlotDisabled = (date, time) => {
    const now = new Date();
    const slotDateTime = parseISO(`${date}T${time}`);
    const cutoffTime = addMinutes(now, -GRACE_PERIOD_MINUTES);

    if (format(now, "yyyy-MM-dd") === date) {
      return isBefore(slotDateTime, cutoffTime);
    }

    return isBefore(slotDateTime, now);
  };

  return (
    <div className="md:py-5 md:px-7 py-5 px-4">
      <main>
        <div className="flex items-center justify-center md:mb-5 mb-5 flex-col">
          <h1 className="text-2xl font-bold text-primary">Book</h1>
          <h1 className="text-md font-bold text-muted-foreground">
            {getFormattedDate()}
          </h1>
        </div>

        <div className="flex justify-center ">
          <div className="">
            <div className="sticky z-0">
              <Table>
                <TableHeader className="">
                  <TableRow className="dark:border-neutral-600">
                    <TableHead className="w-24">Time</TableHead>
                    {loading
                      ? weekDates.map((date, index) => (
                          <TableHead key={index} className="w-24">
                            {date}
                          </TableHead>
                        ))
                      : dates.map((date) => (
                          <TableHead key={date} className="w-24">
                            {formatDate(date)}
                          </TableHead>
                        ))}
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="md:h-[65vh] h-[60vh] overflow-auto">
              <Table>
                <TableBody>
                  {loading
                    ? times.map((time, rowIndex) => (
                        <TableRow
                          key={rowIndex}
                          className="dark:border-neutral-600"
                        >
                          <TableCell
                            key={`time-${rowIndex}`}
                            className={`md:w-20 w-18 md:text-md text-sm`}
                          >
                            <span className="text-primary">{time}</span>
                          </TableCell>
                          {Array.from({ length: 7 }).map((_, colIndex) => (
                            <TableCell key={colIndex} className="w-24">
                              <Skeleton className="md:h-[22px] h-[22px] w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : timeSlots.map((time) => (
                        <TableRow
                          key={time}
                          className="dark:border-neutral-600"
                        >
                          <TableCell
                            className={`md:w-20 w-18 md:text-md text-sm`}
                          >
                            <span className="text-primary">{time}</span>
                          </TableCell>

                          {dates.map((date) => {
                            const cellValue = data[date][time];
                            const isDisabled = isTimeSlotDisabled(date, time);

                            return (
                              <td
                                key={date + time}
                                className="w-24 text-center"
                              >
                                {!isDisabled &&
                                cellValue < MAX_DAILY_BOOKING ? (
                                  <Drawer>
                                    <DrawerTrigger
                                      asChild
                                      onClick={() =>
                                        setSelectedTime({ date, time })
                                      }
                                    >
                                      <TableCell
                                        className={`w-24 text-center ${
                                          cellValue < MAX_DAILY_BOOKING
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                        } ${getThemeAwareColor(
                                          cellValue
                                        )} text-foreground`}
                                      >
                                        {cellValue === 100
                                          ? cellValue
                                          : 5 - cellValue}
                                      </TableCell>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                      <div className="mx-auto w-full max-w-sm">
                                        <DrawerHeader>
                                          <DrawerTitle>Booking</DrawerTitle>
                                          <DrawerDescription>
                                            Set your booking
                                          </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="p-4 flex flex-col gap-3 text-foreground">
                                          <h5>
                                            {formatDateTime({ date, time })}
                                          </h5>
                                          <Separator />
                                          <div>
                                            <ToggleGroup
                                              type="single"
                                              className="grid grid-cols-3 gap-3"
                                              defaultValue={selectedTimeSlot}
                                              onValueChange={
                                                setSelectedTimeSlot
                                              }
                                            >
                                              {getAvailableTimeSlots(
                                                date,
                                                time
                                              ).map((slot, index) => (
                                                <ToggleGroupItem
                                                  value={slot}
                                                  key={index}
                                                >
                                                  {slot} Hour
                                                </ToggleGroupItem>
                                              ))}
                                            </ToggleGroup>
                                          </div>
                                        </div>
                                        <DrawerFooter>
                                          <Dialog>
                                            <DialogTrigger
                                              disabled={
                                                selectedTimeSlot === null ||
                                                selectedTimeSlot === 0 ||
                                                selectedTimeSlot ===
                                                  undefined ||
                                                selectedTimeSlot === "" ||
                                                isBooking === true ||
                                                loading === true
                                              }
                                            >
                                              <Button
                                                className="w-full flex justify-center items-center gap-3"
                                                disabled={
                                                  selectedTimeSlot === null ||
                                                  selectedTimeSlot === 0 ||
                                                  selectedTimeSlot ===
                                                    undefined ||
                                                  selectedTimeSlot === "" ||
                                                  isBooking === true ||
                                                  loading === true
                                                }
                                              >
                                                {isBooking ? (
                                                  <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                  <></>
                                                )}
                                                {isBooking
                                                  ? "Booking..."
                                                  : "Book"}
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                              <DialogHeader>
                                                <DialogTitle>
                                                  Are you absolutely sure?
                                                </DialogTitle>
                                                <DialogDescription>
                                                  <div className="pt-2">
                                                    You are about to book{" "}
                                                    {formatDateTime({
                                                      date,
                                                      time,
                                                    })}{" "}
                                                    {selectedTimeSlot} for Hour.
                                                  </div>
                                                  <div className="w-full flex items-end justify-end">
                                                    <DrawerClose>
                                                      <DialogClose asChild>
                                                        <Button
                                                          className="mt-2"
                                                          onClick={bookSlot}
                                                        >
                                                          Confirm
                                                        </Button>
                                                      </DialogClose>
                                                    </DrawerClose>
                                                  </div>
                                                </DialogDescription>
                                              </DialogHeader>
                                            </DialogContent>
                                          </Dialog>
                                          <DrawerClose asChild>
                                            <Button variant="outline">
                                              Cancel
                                            </Button>
                                          </DrawerClose>
                                        </DrawerFooter>
                                      </div>
                                    </DrawerContent>
                                  </Drawer>
                                ) : (
                                  <TableCell
                                    className={`w-24 text-center cursor-not-allowed ${getThemeAwareColor(
                                      cellValue,
                                      isDisabled
                                    )} text-primary`}
                                  >
                                    <div>
                                      {cellValue === 100 ? (
                                        <User className="md:w-4 md:h-4 w-3 h-3 inline-block" />
                                      ) : (
                                        5 - cellValue
                                      )}
                                    </div>
                                  </TableCell>
                                )}
                              </td>
                            );
                          })}
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto mt-6 mb-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5" />
              Legend
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid md:grid-cols-3 grid-cols-2 items-center justify-center gap-4 flex-wrap">
                {legendItems.map((item) => (
                  <div key={item.value} className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center ${getThemeAwareColor(
                        item.value
                      )}`}
                    >
                      {item.value === 100 && (
                        <User className="w-4 h-4 text-primary" />
                      )}
                      {item.value !== 100 && (
                        <span className="text-xs text-primary">
                          {5 - item.value}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DockBar */}
        <div className="fixed right-0 left-0 md:bottom-5 bottom-5 z-50">
          <DockBar />
        </div>
      </main>
    </div>
  );
}

export default Book;
