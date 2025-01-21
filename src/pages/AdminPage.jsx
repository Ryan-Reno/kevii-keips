import { useEffect, useState } from "react";
import { DockBar } from "./Dock";
import { formatDateTimeMix, getFormattedDate } from "../helper/functions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "../axiosInstance";
import { Badge } from "@/components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function AdminPage() {
  const [demerits, setDemerits] = useState({});
  const [qrcode, setQRCodes] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/api/demerit/all")
      .then((response) => {
        setDemerits(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/api/qrcode")
      .then((response) => {
        setQRCodes(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [refresh]);

  function deactivateCode(code) {
    axiosInstance
      .patch(`/api/qrcode/${code}/deactivate`)
      .then((response) => {
        console.log(response.data);
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function addQRCode() {
    axiosInstance
      .post("/api/qrcode", {
        name,
        code,
      })
      .then((response) => {
        console.log(response.data);
        setRefresh(refresh + 1);
        setName("");
        setCode("");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="md:py-5 md:px-7 py-5 px-4">
      <div className="flex items-center justify-center md:mb-5 mb-5 flex-col">
        <h1 className="text-2xl font-bold text-primary">Admin</h1>
        <h1 className="text-md font-bold text-muted-foreground">
          {getFormattedDate()}
        </h1>
      </div>
      <main className="mb-20">
        <Tabs defaultValue="penalty" className="w-full max-w-md mx-auto">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="penalty">
              Penalty
            </TabsTrigger>
            <TabsTrigger className="w-full" value="qrcode">
              QR Code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="penalty">
            <Card>
              <CardHeader>
                <CardTitle>Penalty Points</CardTitle>
                <CardDescription className="flex items-center gap-3 pt-1">
                  <Badge>{demerits?.statistics?.totalDemerits} Penalties</Badge>
                  <Badge>{demerits?.statistics?.totalPoints} Points</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {demerits?.demerits?.map((demerit) => (
                  <Card key={demerit._id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <p className="font-medium">{demerit.reason}</p>
                          <p className="text-sm text-muted-foreground">
                            {demerit.user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTimeMix(demerit.checkedAt)}
                          </p>
                        </div>
                        <Badge variant="outline">{demerit.points} Point</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="qrcode">
            <Card>
              <CardHeader>
                <CardTitle>QR Codes</CardTitle>
                <CardDescription className="flex items-center gap-3 pt-1 justify-between">
                  <Badge>
                    {qrcode?.filter((q) => q.active).length} Active Codes
                  </Badge>

                  <Dialog>
                    <DialogTrigger>
                      <Button>Add QR Code</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add QR Code</DialogTitle>
                        <DialogDescription>
                          <div className="grid gap-4 pt-3">
                            <div className="grid gap-2">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="code">Code</Label>
                              <Input
                                id="code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="input"
                              />
                            </div>
                            <DialogClose className="flex justify-end gap-4">
                              <Button onClick={addQRCode}>Add</Button>
                            </DialogClose>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {qrcode?.map((qrcode) => (
                  <Card key={qrcode._id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <p className="font-medium">{qrcode.name}</p>
                          <p className="text-sm text-muted-foreground overflow-clip max-w-60">
                            {qrcode.code}
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger disabled={!qrcode.active}>
                            <DialogClose
                              className={`${
                                qrcode.active
                                  ? "cursor-pointer"
                                  : "cursor-default"
                              }`}
                            >
                              <Badge variant={qrcode.active ? "" : "outline"}>
                                {qrcode.active ? "Active" : "Not Active"}
                              </Badge>
                            </DialogClose>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                This will deactivate the QR Code.
                                <DialogClose className="w-full flex justify-end gap-4 pt-3">
                                  <Button
                                    onClick={() => deactivateCode(qrcode.code)}
                                    variant="destructive"
                                  >
                                    Deactivate
                                  </Button>
                                </DialogClose>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <div className="fixed right-0 left-0 md:bottom-5 bottom-5 z-50">
        <DockBar />
      </div>
    </div>
  );
}

export default AdminPage;
