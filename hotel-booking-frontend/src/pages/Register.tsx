import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useMutationWithLoading } from "../hooks/useLoadingHooks";
import * as apiClient from "../api-client";
import useAppContext from "../hooks/useAppContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  UserPlus,
  Sparkles,

} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutationWithLoading(apiClient.register, {
    onSuccess: async () => {
      showToast({
        title: "Registration Successful",
        description:
          "Your account has been created successfully! Welcome to SmartNest.",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({
        title: "Registration Failed",
        description: error.message,
        type: "ERROR",
      });
    },
    loadingMessage: "Creating your account...",
  });

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true);
    mutation.mutate(data, {
      onSettled: () => setIsLoading(false),
    });
  });

  const password = watch("password");

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-100 rounded-full opacity-50"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-200 rounded-full opacity-30"></div>

          <CardHeader className="text-center relative z-10 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Join SmartNest
            </CardTitle>
            <CardDescription className="text-gray-600">
              Create your account to start booking your perfect boarding
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form className="space-y-6" onSubmit={onSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                    First Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <Input
                      id="firstName"
                      type="text"
                      className="pl-10"
                      placeholder="Enter first name"
                      {...register("firstName", { required: "First name is required" })}
                    />
                  </div>
                  {errors.firstName && (
                    <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 mt-1">
                      <Sparkles className="w-4 h-4 mr-1" />
                      {errors.firstName.message}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                    Last Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <Input
                      id="lastName"
                      type="text"
                      className="pl-10"
                      placeholder="Enter last name"
                      {...register("lastName", { required: "Last name is required" })}
                    />
                  </div>
                  {errors.lastName && (
                    <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 mt-1">
                      <Sparkles className="w-4 h-4 mr-1" />
                      {errors.lastName.message}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail className="h-6 w-6 text-gray-600" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    placeholder="Enter your email"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 mt-1">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </Badge>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Lock className="h-6 w-6 text-gray-600" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-12"
                    placeholder="Create a password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 pr-3 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                {errors.password && (
                  <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 mt-1">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {errors.password.message}
                  </Badge>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Lock className="h-6 w-6 text-gray-600" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-10 pr-12"
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      validate: (val) => {
                        if (!val) return "Please confirm your password";
                        else if (password !== val) return "Passwords do not match";
                      },
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 pr-3 h-full"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 mt-1">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {errors.confirmPassword.message}
                  </Badge>
                )}
              </div>

              {/* ✅ Terms & Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                  {...register("agreeToTerms", {
                    required: "You must agree to the Terms and Conditions",
                  })}
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`📜 Terms and Conditions for SmartNest

1. Acceptance of Terms: By using this app, you agree to comply with these terms and conditions.
2. User Eligibility: You must be at least 18 years old or have parental consent to use this app.
3. User Account: You are responsible for maintaining the confidentiality of your account information and all activities under your account.
4. Service Description: The app provides listings of boarding houses near university premises. We do not guarantee accuracy; verify details yourself.
5. User Conduct: You agree not to use the app for illegal activities or post false, misleading, defamatory, or offensive content.
6. Booking and Payments: Any booking or payment arrangement is strictly between you and the boarding house owner.
7. Privacy: Your data will be handled according to our Privacy Policy.
8. Limitation of Liability: We are not responsible for any damages or losses from using the app or staying at listed boardings.
9. Termination: We may suspend or terminate your access for violations of these terms.
10. Modifications: Terms may change anytime; continued use means acceptance of updated terms.
11. Governing Law: These terms are governed by the laws of the operating country.
12. Contact Us: Contact support for inquiries.`);
                    }}
                    className="text-primary-600 hover:underline"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  {errors.agreeToTerms.message}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-md text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <Separator className="bg-gray-300" />
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/sign-in"
                    className="font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-2"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
