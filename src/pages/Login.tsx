
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset instructions sent to your email");
      setResetPasswordMode(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset instructions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FF] font-inter">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1E1E1E]">NextClaim</h2>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-[#1E1E1E] text-white hover:bg-[#333] border-0"
          >
            Contact Us
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-semibold text-[#1E1E1E] mb-3">
              {resetPasswordMode ? "Reset Password" : "Welcome Back"}
            </h1>
            <p className="text-[#666] text-base">
              {resetPasswordMode 
                ? "Enter your email to receive reset instructions"
                : "Effortlessly manage your unemployment claims through our secure platform"}
            </p>
          </div>

          <form onSubmit={resetPasswordMode ? handleResetPassword : handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#1E1E1E]">
                User Code
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your user code"
                className="w-full border-gray-200 focus:border-blue-500"
                required
              />
            </div>

            {!resetPasswordMode && (
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#1E1E1E]">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border-gray-200 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {!resetPasswordMode && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm text-[#1E1E1E] leading-none"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => setResetPasswordMode(true)}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#1E1E1E] hover:bg-[#333] text-white"
              disabled={isLoading}
            >
              {isLoading 
                ? resetPasswordMode ? "Sending..." : "Signing in..." 
                : resetPasswordMode ? "Send Reset Instructions" : "Sign in"
              }
            </Button>

            {resetPasswordMode && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600"
                  onClick={() => setResetPasswordMode(false)}
                >
                  Back to Sign In
                </Button>
              </div>
            )}
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Your account activity is monitored for security purposes. Ensure your information is up to date for seamless processing of claims.
            </p>
            <p className="text-xs text-gray-500">
              Powered by Sails Software
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
