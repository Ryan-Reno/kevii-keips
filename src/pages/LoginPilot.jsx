import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axiosInstance from "../axiosInstance";
import { useToast } from "../hooks/use-toast";

function LoginPilot() {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (event) => {
    setIsLoggingIn(true);
    event.preventDefault();

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await axiosInstance.post("/api/auth/login", {
          email: email,
          password: "Test123!",
        });

        console.log(response.data);

        setIsLoggingIn(false);

        if (response.status === 200) {
          localStorage.setItem("kevii-gym-token", response.data.token);
          response.data.user.admin &&
            localStorage.setItem("kevii-gym-admin", response.data.user.admin);

          toast({
            title: "Login Successful",
            description: "You will be redirected shortly.",
            variant: "default",
          });

          setTimeout(() => {
            window.location.href = "/dashboard";
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
              <p className="text-balance text-muted-foreground">
                MATNET: 123Z4567
              </p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4 text-primary">
            <div className="grid gap-2">
              <Label htmlFor="email">MATNET</Label>
              <Input
                id="email"
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
