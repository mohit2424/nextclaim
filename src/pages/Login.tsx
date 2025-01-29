import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function Login() {
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app would validate against backend
    if (userCode === "analyst@example.com" && password === "password") {
      toast.success("Login successful");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8 px-4">
          <h2 className="text-2xl font-bold">NextClaim</h2>
          <Button variant="outline">Contact Us</Button>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">
              Effortlessly manage your unemployment claims through our secure platform
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="userCode" className="block text-sm font-medium">
                User Code
              </label>
              <Input
                id="userCode"
                type="email"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="Enter your user code"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-black/90">
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">
              Your account activity is monitored for security purposes. Ensure your
              information is up to date for seamless processing of claims.
            </p>
            <p className="text-xs text-gray-400">
              Powered by Sails Software
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}