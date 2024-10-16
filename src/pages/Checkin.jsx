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
  formatDateTimeMix,
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
  const [checkinStatus, setCheckinStatus] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const handleQrResult = (result) => {
    setScanResult(result);
  };

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

  const checkIn = () => {
    setIsCheckingIn(true);

    axiosInstance
      .post("/api/checkin/checkin")
      .then((response) => {
        console.log(response.data);
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
      .then((response) => {
        console.log(response.data);
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

  return (
    <>
      <div className="absolute right-0 top-4 left-0 md:relative z-50">
        <Toaster />
      </div>
      <div className="md:py-5 md:px-7 py-10 px-4">
        <div className="flex items-center justify-center md:mb-3 mb-5 flex-col">
          <h1 className="text-2xl font-bold text-primary">Checkin</h1>
          <h1 className="text-md font-bold text-muted-foreground">
            {getFormattedDate()}
          </h1>
        </div>
        {/* TODO: idk what is this page for */}

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
                {formatDateTimeMix(
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
        ) : scanResult === "KEVII GYM: N3s9DZ91Q4hGt2AEVKSg4" ? (
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
            <Button onClick={openQRFunc}>{openQr ? "Close" : "Checkin"}</Button>

            {!openQr &&
              scanResult !== "KEVII GYM: N3s9DZ91Q4hGt2AEVKSg4" &&
              scanResult !== "" && (
                <p className="pt-2 text-red-700">
                  Invalid QR Code. Please Try Again
                </p>
              )}

            <div className="pt-3">
              {openQr && <QrReader onResult={handleQrResult} />}
            </div>
          </div>
        )}

        <div className="fixed right-0 left-0 md:bottom-5 bottom-10">
          <DockBar />
        </div>
      </div>
    </>
  );
}

export default Checkin;
