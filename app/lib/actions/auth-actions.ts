"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginFormData, RegisterFormData } from "../types";

export async function login(data: LoginFormData) {
  /**
   * Authenticates a user with email and password credentials.
   *
   * This function handles user sign-in by leveraging Supabase's built-in authentication
   * service. It provides a secure way to authenticate users without storing passwords
   * locally or implementing custom authentication logic.
   *
   * @param data - Login form data containing user credentials
   * @param data.email - User's email address (validated by Supabase)
   * @param data.password - User's password (validated by Supabase)
   *
   * @returns Promise<{error: string | null}> - Returns null on success, error message on failure
   *
   * Error Handling:
   * - Supabase handles input validation (email format, password requirements)
   * - Authentication errors (invalid credentials, user not found) are caught and returned
   * - Network/service errors are propagated through Supabase's error handling
   *
   * Security Notes:
   * - Passwords are never stored or logged locally
   * - Supabase handles secure password comparison and session management
   * - Authentication state is managed server-side for security
   */

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Success: no error
  return { error: null };
}

export async function register(data: RegisterFormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Success: no error
  return { error: null };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}
