import { useEffect, useState } from "react";
import { DockBar } from "./Dock";
import QrReader from "../components/QrReader";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "../axiosInstance";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getFormattedDate,
  getFormattedDateTime,
  formatDateTimeMixNoOffset,
} from "../helper/functions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

function Checkin() {
  const { toast } = useToast();

  const [openQr, setOpenQr] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkinStatus, setCheckinStatus] = useState({});
  const [checkinData, setCheckinData] = useState({});
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [isFetchingStatusCheckins, setIsFetchingStatusCheckins] =
    useState(true);
  const [refresh, setRefresh] = useState(0);
  const [correctQr, setCorrectQr] = useState(false);

  useEffect(() => {
    if (scanResult !== "") {
      setOpenQr(false);
    }
  }, [scanResult]);

  useEffect(() => {
    setIsFetchingStatus(true);
    axiosInstance
      .get("/api/checkin/status")
      .then((response) => {
        setCheckinStatus(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsFetchingStatus(false);
      });
  }, [refresh]);

  useEffect(() => {
    setIsFetchingStatusCheckins(true);
    axiosInstance
      .get("/api/checkin/all")
      .then((response) => {
        setCheckinData(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsFetchingStatusCheckins(false);
      });
  }, [refresh]);

  const checkIn = () => {
    setIsCheckingIn(true);

    axiosInstance
      .post("/api/checkin/checkin")
      .then(() => {
        toast({
          title: "Check-in Successful",
          description: "You have successfully checked in.",
          variant: "default",
        });
        setRefresh((prev) => prev + 1);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Check-in Failed",
          description: `${error.response.data.error}`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsCheckingIn(false);
      });
  };

  const checkOut = () => {
    setIsCheckingIn(true);

    axiosInstance
      .post("/api/checkin/checkout")
      .then(() => {
        toast({
          title: "Check-out Successful",
          description: "You have successfully checked out.",
          variant: "default",
        });
        setRefresh((prev) => prev + 1);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Check-out Failed",
          description: `${error.response.data.error}`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsCheckingIn(false);
      });
  };

  const openQRFunc = () => {
    setScanResult("");
    setOpenQr(!openQr);
  };

  const handleQrResult = (result) => {
    setScanResult(result);

    axiosInstance
      .get(`/api/qrcode/${result}`)
      .then((response) => {
        const { active } = response.data;

        if (active) {
          setCorrectQr(true);
        } else {
          toast({
            title: "Inactive QR Code",
            description: "This code is inactive. Please try again.",
            variant: "destructive",
          });
          setScanResult("");
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Invalid QR Code",
          description: "The scanned QR code is not valid.",
          variant: "destructive",
        });
        setScanResult("");
      });
  };

  return (
    <>
      <div className="absolute right-0 top-4 left-0 md:relative z-50">
        <Toaster />
      </div>
      <div className="md:py-5 md:px-7 py-5 px-4 pb-20">
        <div className="flex items-center justify-center md:mb-5 mb-5 flex-col">
          <h1 className="text-2xl font-bold text-primary">Checkin</h1>
          <h1 className="text-md font-bold text-muted-foreground">
            {getFormattedDate()}
          </h1>
        </div>
        {isFetchingStatus ? (
          <div>
            <Skeleton className="w-full h-48" />
          </div>
        ) : checkinStatus?.status !== "checked-out" ? (
          <Card>
            <CardHeader>
              <CardTitle>Checking Out?</CardTitle>
              <CardDescription>KEVII GYM</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                {formatDateTimeMixNoOffset(
                  new Date(checkinStatus?.checkIn?.checkInTime)
                )}
              </p>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger disabled={isCheckingIn}>
                  <Button
                    disabled={isCheckingIn}
                    className="flex items-center justify-center gap-3"
                    variant="secondary"
                  >
                    {isCheckingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <></>
                    )}
                    Check Out
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="pt-2 pb-4">
                      This will check you out from KEVII GYM.
                    </DialogDescription>
                    <DialogClose asChild>
                      <Button onClick={checkOut} variant="secondary">
                        Confirm Check Out
                      </Button>
                    </DialogClose>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ) : correctQr ? (
          <Card>
            <CardHeader>
              <CardTitle>Checking in?</CardTitle>
              <CardDescription>KEVII GYM</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{getFormattedDateTime()}</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={checkIn}
                disabled={isCheckingIn}
                className="flex items-center justify-center gap-3"
              >
                {isCheckingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <></>
                )}
                Check In
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div>
            <Button onClick={openQRFunc} className="w-full">
              {openQr ? "Close" : "Checkin"}
            </Button>

            {!openQr && correctQr && scanResult !== "" && (
              <p className="pt-2 text-red-700">
                Invalid QR Code. Please Try Again
              </p>
            )}

            <div className="pt-3">
              {openQr && <QrReader onResult={handleQrResult} />}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Past Check-ins
          </h2>
          {isFetchingStatusCheckins ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : checkinData.length > 0 ? (
            checkinData.map((checkin) => (
              <Card key={checkin._id} className="mb-4">
                <CardHeader className="pb-1">
                  <CardTitle className="text-lg">
                    {checkin.checkOutTime
                      ? "Completed Session"
                      : "Ongoing Session"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Check-in:{" "}
                    {formatDateTimeMixNoOffset(new Date(checkin.checkInTime))}
                  </p>
                  {checkin.checkOutTime && (
                    <p>
                      Check-out:{" "}
                      {formatDateTimeMixNoOffset(
                        new Date(checkin.checkOutTime)
                      )}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No past check-ins found.</p>
          )}
        </div>

        <div className="fixed right-0 left-0 md:bottom-5 bottom-5 z-50">
          <DockBar />
        </div>
      </div>
    </>
  );
}

export default Checkin;
