import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axiosInstance from "../axiosInstance";
import { useToast } from "../hooks/use-toast";

function Login() {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (event) => {
    setIsLoggingIn(true);

    event.preventDefault();

    const emailRegex = /^[Ee]\d{7}(@u.nus.edu)?$/;

    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid NUS email or NUS ID.",
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
      const response = await axiosInstance.post("/api/auth/login", {
        email: formattedEmail,
        password: password,
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
          window.location.href = "/dashboard";
        }, 500);
      }
    } catch (error) {
      setIsLoggingIn(false);
      console.error("Login error:", error.response?.data || error.message);
      toast({
        title: "Login Failed",
        description: "Wrong email or password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full md:grid md:grid-cols-2 grid-cols-1 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Use your NUS ID to login
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
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
              <Label htmlFor="password">Password</Label>
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
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline" disabled={isLoggingIn}>
              Register
            </a>
          </div>
        </div>
      </div>
      <div className="hidden md:block bg-muted col-span-1">
        <img
          src="/src/assets/ke7.jpg"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default Login;
