import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleHelp, Copy, Loader2, LogIn } from "lucide-react";
import axiosInstance from "../axiosInstance";
import { useToast } from "../hooks/use-toast";
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

function LoginPilot() {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [matric, setMatric] = useState("");
  const [nusnet, setNusnet] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (event) => {
    setIsLoggingIn(true);
    event.preventDefault();

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await axiosInstance.post("/api/auth/keipsLogin", {
          matNET: email,
        });

        console.log(response.data);

        setIsLoggingIn(false);

        if (response.status === 200) {
          localStorage.setItem("kevii-gym-token", response.data.token);


          toast({
            title: "Login Successful",
            description: "You will be redirected shortly.",
            variant: "default",
          });

          setTimeout(() => {
            window.location.href = "/keips";
          }, 500);

          return;
        }
      } catch (error) {
        console.error(
          "Login error attempt " + (attempt + 1) + ":",
          error.response?.data || error.message
        );

        if (attempt === 1) {
          setIsLoggingIn(false);
          toast({
            title: "Login Failed",
            description: "Wrong email or ID.",
            variant: "destructive",
          });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "MATNET: " + text,
      variant: "default",
    });
  };

  const putToEmail = (text) => {
    setEmail(text);
    toast({
      title: "Entered to form",
      description: "MATNET: " + text,
      variant: "default",
    });
  };

  return (
    <div className="w-full md:grid md:grid-cols-2 grid-cols-1 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-primary">Login</h1>
            <div className="flex flex-col">
              <p className="text-balance text-muted-foreground">
                Matric Number: AXXXX123Z
              </p>
              <p className="text-balance text-muted-foreground">
                NUSNET: EXXX4567
              </p>
              <p className="text-balance text-muted-foreground flex gap-1 items-center justify-center">
                MATNET: 123Z4567
                <Drawer>
                  <DrawerTrigger>
                    <CircleHelp className="w-4 h-4 inline-block text-muted-foreground" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader className="grid gap-2">
                        <DrawerTitle>Confused?</DrawerTitle>
                        <p className="text-muted-foreground text-sm">
                          Your MATNET is the last 4 digits of your Matric Number
                          followed by the last 4 digits of your NUSNET.
                        </p>
                        <DrawerDescription className="grid gap-4 pt-3">
                          <div className="grid gap-1">
                            <Label htmlFor="matric">Matric Number</Label>
                            <Input
                              id="matric"
                              type="string"
                              placeholder="e.g., A1234678Z"
                              value={matric}
                              onChange={(e) => setMatric(e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor="nusnet">NUSNET</Label>
                            <Input
                              id="nusnet"
                              type="string"
                              placeholder="e.g., E1234567"
                              value={nusnet}
                              onChange={(e) => setNusnet(e.target.value)}
                              required
                            />
                          </div>
                          {matric &&
                            nusnet &&
                            matric.trim().length === 9 &&
                            nusnet.trim().length === 8 && (
                              <div className="flex gap-8 items-center justify-center">
                                <p className="text-primary text-lg">
                                  MATNET:{" "}
                                  <span className="font-bold">
                                    {matric.trim().substring(5, 9)}
                                    {nusnet.trim().substring(4, 8)}
                                  </span>
                                </p>

                                <div
                                  className="flex flex-col items-center"
                                  onClick={() =>
                                    copyText(
                                      matric.trim().substring(5, 9) +
                                        nusnet.trim().substring(4, 8)
                                    )
                                  }
                                >
                                  <Copy className="text-muted-foreground w-4" />
                                  <p>Copy</p>
                                </div>
                                <DrawerClose>
                                  <div
                                    className="flex flex-col items-center"
                                    onClick={() =>
                                      putToEmail(
                                        matric.trim().substring(5, 9) +
                                          nusnet.trim().substring(4, 8)
                                      )
                                    }
                                  >
                                    <LogIn className="text-muted-foreground w-4" />
                                    <p>Enter</p>
                                  </div>
                                </DrawerClose>
                              </div>
                            )}
                        </DrawerDescription>
                      </DrawerHeader>
                    </div>
                    <DrawerFooter>
                      <DrawerClose>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4 text-primary">
            <div className="grid gap-2">
              <Label htmlFor="matnet">MATNET</Label>
              <Input
                id="matnet"
                type="string"
                placeholder="e.g., 123Z4567 or 666X9999"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full flex gap-3 items-center justify-center"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <></>
              )}
              Login
            </Button>
          </form>
          {/* <div className="mt-4 text-center text-sm text-primary">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline" disabled={isLoggingIn}>
              Register
            </a>
          </div> */}
        </div>
      </div>
      <div className="hidden md:block bg-muted col-span-1">
        <img
          src="/images/ke7.jpg"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default LoginPilot;
