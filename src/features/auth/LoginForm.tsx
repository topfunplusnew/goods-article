"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { loginWithPassword } from "@/features/auth/api";
import { resolveSafeRedirectTarget } from "@/features/auth/session";
import { writeAuthTokenToDocument } from "@/features/auth/client";

interface LoginFormProps {
  usernameLabel: string;
  usernamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginLabel: string;
  loadingLabel: string;
  loginFailedLabel: string;
}

export function LoginForm(props: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTarget = resolveSafeRedirectTarget(searchParams.get("redirect"));

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
          const session = await loginWithPassword({ username, password });
          writeAuthTokenToDocument(session.accessToken);
          router.replace(redirectTarget);
          router.refresh();
        } catch {
          setError(props.loginFailedLabel);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-700">
          {props.usernameLabel}
        </span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          className="input"
          autoComplete="username"
          placeholder={props.usernamePlaceholder}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-700">
          {props.passwordLabel}
        </span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="input"
          autoComplete="current-password"
          placeholder={props.passwordPlaceholder}
        />
      </label>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={submitting || !username || !password}
      >
        {submitting ? props.loadingLabel : props.loginLabel}
      </button>
    </form>
  );
}
