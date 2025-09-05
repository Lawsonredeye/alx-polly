"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/app/lib/actions/auth-actions";

export default function LoginPage() {
  /**
   * LoginPage component for ALX Polly authentication system.
   *
   * This component serves as the primary entry point for user authentication in the polling application.
   * It handles the complete login flow from form submission to session establishment and routing.
   *
   * Context & Purpose:
   * - Acts as a gateway to the main application functionality (/polls)
   * - Establishes user sessions required for creating/viewing polls
   * - Integrates with the app's auth system via auth-actions
   *
   * Key Behaviors:
   * - Prevents default form submission to handle authentication client-side
   * - Uses FormData API for robust form data extraction
   * - Performs full page reload after successful login to ensure session pickup
   * - Provides visual feedback during authentication process
   *
   * Assumptions:
   * - The login() function from auth-actions handles session creation
   * - Email/password fields are required and validated by HTML5
   * - Successful authentication redirects to /polls as the main app entry point
   * - Window.location.href is used intentionally for full reload vs Next.js router
   *
   * Edge Cases Handled:
   * - Network failures or auth service errors (displays error message)
   * - Form submission during loading state (button disabled)
   * - Missing or malformed form data (FormData casting)
   * - User navigating away during auth process (loading state cleanup)
   *
   * Component Relationships:
   * - Links to /register for new user registration
   * - Redirects to /polls upon successful authentication
   * - Depends on auth-actions for backend authentication
   * - Uses shared UI components (Button, Input, Card, etc.)
   *
   * State Management:
   * - error: Displays authentication failures to user
   * - loading: Prevents duplicate submissions and shows progress
   */
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await login({ email, password });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      window.location.href = "/polls"; // Full reload to pick up session
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login to ALX Polly
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
