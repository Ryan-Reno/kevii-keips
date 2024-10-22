import { useEffect, useState } from "react";
import { DockBar } from "./Dock";
import {
  getFormattedDate,
  formatDateTimeMixNoOffset,
} from "../helper/functions";
import axiosInstance from "../axiosInstance";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Loader2, Calendar, Edit, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format, addHours, parseISO, isBefore, addMinutes } from "date-fns";

const BOOKING_START_TIME = "06:00";
const BOOKING_END_TIME = "23:00";

const generateTimeSlots = () => {
  const slots = [];
  let currentTime = parseISO(`2024-01-01T${BOOKING_START_TIME}`);
  const endTime = parseISO(`2024-01-01T${BOOKING_END_TIME}`);

  while (isBefore(currentTime, endTime)) {
    slots.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, 30);
  }
  slots.push(BOOKING_END_TIME);
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

function Dashboard() {
  const { toast } = useToast();
  const [isFetchingPopulation, setIsFetchingPopulation] = useState(false);
  const [isFetchingBooking, setIsFetchingBooking] = useState(false);
  const [populations, setPopulations] = useState({
    population: 0,
    message: "",
  });
  const [bookings, setBookings] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    setIsFetchingPopulation(true);
    axiosInstance
      .get("/api/checkin/population")
      .then((response) => {
        setPopulations(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch gym population",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsFetchingPopulation(false);
      });
  }, [refresh]);

  useEffect(() => {
    setIsFetchingBooking(true);
    axiosInstance
      .get("/api/bookings/upcoming")
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch upcoming bookings",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsFetchingBooking(false);
      });
  }, [refresh]);

  const isBookingEditable = (bookingDate) => {
    const utcOffset = 8 * 60;

    const bookingDateTime = new Date(bookingDate);

    const bookingTime = new Date(
      bookingDateTime.getTime() - utcOffset * 60 * 1000
    );

    const currentTime = new Date();
    const oneHourFromNow = addHours(currentTime, 1);

    const before = isBefore(oneHourFromNow, bookingTime);

    return before;
  };

  function editBooking(bookingId) {
    if (bookingId && selectedDuration && selectedTime) {
      setIsUpdating(true);

      const [hours, minutes] = selectedTime.split(":");
      const bookingDate = new Date(selectedBooking.date);
      const newDate = new Date(
        Date.UTC(
          bookingDate.getUTCFullYear(),
          bookingDate.getUTCMonth(),
          bookingDate.getUTCDate(),
          parseInt(hours),
          parseInt(minutes)
        )
      );

      console.log(newDate, selectedTime, selectedDuration);

      axiosInstance
        .patch(`/api/bookings/${bookingId}`, {
          duration: selectedDuration,
          date: newDate.toISOString(),
        })
        .then(() => {
          toast({
            title: "Success",
            description: "Booking updated successfully.",
          });
          setRefresh((prev) => prev + 1);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.error || "Failed to update booking",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }
  }

  function deleteBooking(bookingId) {
    if (bookingId) {
      setIsUpdating(true);
      axiosInstance
        .delete(`/api/bookings/${bookingId}`)
        .then(() => {
          toast({
            title: "Success",
            description: "Booking deleted successfully.",
          });
          setRefresh((prev) => prev + 1);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.error || "Failed to delete booking",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }
  }

  const handleBookingSelect = (booking) => {
    setSelectedBooking(booking);
    const timeString = booking.date.split("T")[1].slice(0, 5);
    setSelectedTime(timeString);
    setSelectedDuration(booking.duration);
  };

  return (
    <div className="md:py-5 md:px-7 py-5 px-4">
      <div className="flex items-center justify-center md:mb-3 mb-3 flex-col">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <h1 className="text-md font-bold text-muted-foreground">
          {getFormattedDate()}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Gym Population
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetchingPopulation ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="text-3xl font-bold">
              {populations.population}{" "}
              <span className="text-lg font-normal">people</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetchingBooking ? (
            Array(3)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-24 w-full mb-4" />)
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const isEditable = isBookingEditable(booking.date);
                return (
                  <Card key={booking._id} className="relative">
                    <CardHeader>
                      <CardTitle className="md:text-lg text-md">
                        {formatDateTimeMixNoOffset(booking.date)}
                      </CardTitle>
                      <CardDescription>
                        Duration: {booking.duration} hours
                        {booking.overlappingUsers.length > 0 && (
                          <div className="mt-1">
                            Sharing with:{" "}
                            {booking.overlappingUsers
                              .map((user) => user.name)
                              .join(", ")}
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2 absolute top-5 right-0">
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleBookingSelect(booking)}
                            disabled={!isEditable}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                              <DrawerTitle>Edit Booking</DrawerTitle>
                              <DrawerDescription>
                                Original:{" "}
                                {formatDateTimeMixNoOffset(booking.date)}
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 space-y-4">
                              <div>
                                <h4 className="mb-2 font-medium">
                                  Select Time
                                </h4>
                                <ToggleGroup
                                  type="single"
                                  value={selectedTime}
                                  onValueChange={setSelectedTime}
                                  className="grid grid-cols-4 gap-2"
                                >
                                  {TIME_SLOTS.map((time) => (
                                    <ToggleGroupItem
                                      key={time}
                                      value={time}
                                      className="text-sm"
                                    >
                                      {time}
                                    </ToggleGroupItem>
                                  ))}
                                </ToggleGroup>
                              </div>
                              <div>
                                <h4 className="mb-2 font-medium">
                                  Select Duration
                                </h4>
                                <ToggleGroup
                                  type="single"
                                  value={selectedDuration}
                                  onValueChange={setSelectedDuration}
                                  className="grid grid-cols-3 gap-2"
                                >
                                  {[0.5, 1, 1.5, 2, 2.5, 3].map((duration) => (
                                    <ToggleGroupItem
                                      key={duration}
                                      value={duration}
                                    >
                                      {duration}h
                                    </ToggleGroupItem>
                                  ))}
                                </ToggleGroup>
                              </div>
                            </div>
                            <DrawerFooter>
                              <Button
                                onClick={() => editBooking(booking._id)}
                                disabled={
                                  isUpdating ||
                                  !selectedDuration ||
                                  !selectedTime
                                }
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Save Changes"
                                )}
                              </Button>
                              <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </div>
                        </DrawerContent>
                      </Drawer>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={!isEditable}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Booking</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete your booking for{" "}
                              {formatDateTimeMixNoOffset(booking.date)}? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-3 mt-4">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                variant="destructive"
                                onClick={() => deleteBooking(booking._id)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Delete"
                                )}
                              </Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No upcoming bookings
            </p>
          )}
        </CardContent>
      </Card>

      <div className="fixed right-0 left-0 md:bottom-5 bottom-5 z-50">
        <DockBar />
      </div>
    </div>
  );
}

export default Dashboard;
