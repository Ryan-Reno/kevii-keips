import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axiosInstance from "../axiosInstance";
import { useToast } from "../hooks/use-toast";

function RegisterPilot() {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleRegistration = async (event) => {
    setIsLoggingIn(true);
    event.preventDefault();

    const emailRegex = /^[Ee]\d{7}(@u.nus.edu)?$/;

    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid NUS email.",
        variant: "destructive",
      });

      setIsLoggingIn(false);
      return;
    }

    const formattedEmail = email.endsWith("@u.nus.edu")
      ? `E${email.slice(1)}`
      : `E${email.slice(1)}@u.nus.edu`;

    setEmail(formattedEmail);

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await axiosInstance.post("/api/auth/register", {
          email: formattedEmail,
          name: name,
          password: "Test123!",
        });

        console.log(response.data);

        setIsLoggingIn(false);

        if (response.status === 201) {
          localStorage.setItem("kevii-gym-token", response.data.token);

          toast({
            title: "Registration Successful",
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
          "Registration error attempt " + (attempt + 1) + ":",
          error.response?.data || error.message
        );

        if (attempt === 1) {
          setIsLoggingIn(false);
          toast({
            title: "Registration Failed",
            description: "Unknown Error",
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
      <div className="hidden md:block bg-muted col-span-1">
        <img
          src="/images/ke7.jpg"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-primary">Register</h1>
            <p className="text-balance text-muted-foreground">
              Use your NUS Email or ID to create an account.
            </p>
          </div>
          <form
            onSubmit={handleRegistration}
            className="grid gap-4 text-primary"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="string"
                placeholder="NUSID@u.nus.edu or NUSID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="string"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              Create Account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-primary">
            Already have an account?{" "}
            <a href="/login" className="underline" disabled={isLoggingIn}>
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPilot;
