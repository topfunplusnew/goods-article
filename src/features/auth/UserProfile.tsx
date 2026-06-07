"use client";

import { useEffect, useMemo, useState } from "react";

import { getCurrentUser } from "@/features/auth/api";
import {
  clearAuthTokenFromDocument,
  readAuthTokenFromDocument,
} from "@/features/auth/client";
import type { AuthUser } from "@/features/auth/model";

interface UserProfileProps {
  profileLabel: string;
  profileHint: string;
  loginRequiredLabel: string;
  loginRequiredHint: string;
  loginLabel: string;
  retryLabel: string;
  usernameLabel: string;
  tokenStatusLabel: string;
  authenticatedLabel: string;
  memberSinceLabel: string;
  updatedAtLabel: string;
  logoutLabel: string;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function UserProfile(props: UserProfileProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => readAuthTokenFromDocument(), []);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (loading) {
    return (
      <section className="section-shell animate-pulse rounded-3xl p-6 md:p-8">
        <div className="h-6 w-40 rounded bg-gray-100" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section-shell rounded-3xl px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold text-primary-dark">
          {props.loginRequiredLabel}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500">
          {props.loginRequiredHint}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="section-shell rounded-3xl p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-subtle text-3xl font-semibold text-primary">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-primary-dark">
                {user.username}
              </h2>
              <p className="text-sm uppercase tracking-[0.22em] text-gray-400">
                ID {user.id}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                {props.usernameLabel}
              </p>
              <p className="mt-3 text-xl font-semibold text-primary-dark">
                {user.username}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                {props.tokenStatusLabel}
              </p>
              <p className="mt-3 text-xl font-semibold text-primary-dark">
                {props.authenticatedLabel}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                {props.memberSinceLabel}
              </p>
              <p className="mt-3 text-base font-semibold text-primary-dark">
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                {props.updatedAtLabel}
              </p>
              <p className="mt-3 text-base font-semibold text-primary-dark">
                {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>
        </article>

        <aside className="section-shell rounded-3xl p-6">
          <h2 className="text-lg font-semibold text-primary-dark">
            {props.profileLabel}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-500">
            {props.profileHint}
          </p>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              className="btn btn-primary w-full justify-center"
              onClick={() => {
                clearAuthTokenFromDocument();
                window.location.assign("/");
              }}
            >
              {props.logoutLabel}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
