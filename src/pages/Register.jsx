import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axiosInstance from "../axiosInstance";
import { useToast } from "../hooks/use-toast";

function Register() {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegistration = async (event) => {
    setIsLoggingIn(true);

    event.preventDefault();

    const emailRegex = /^[Ee]\d{7}(@u.nus.edu)?$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid NUS email.",
        variant: "destructive",
      });

      setIsLoggingIn(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      toast({
        title: "Invalid Password",
        description:
          "Password must be at least 8 characters long and include letters and numbers.",
        variant: "destructive",
      });

      setIsLoggingIn(false);
      return;
    }

    const formattedEmail = email.endsWith("@u.nus.edu")
      ? `E${email.slice(1)}`
      : `E${email.slice(1)}@u.nus.edu`;

    setEmail(formattedEmail);

    try {
      const response = await axiosInstance.post("/api/auth/register", {
        email: formattedEmail,
        name: name,
        password: password,
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
      }
    } catch (error) {
      setIsLoggingIn(false);
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      toast({
        title: "Registration Failed",
        description: "Unknown Error",
        variant: "destructive",
      });
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
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="link"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
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

export default Register;
