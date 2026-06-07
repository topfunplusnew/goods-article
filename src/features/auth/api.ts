import type {
  LoginRequestDto,
  TokenResponseDto,
  UserDto,
} from "@/features/auth/contracts";
import {
  mapTokenResponseDtoToModel,
  mapUserDtoToModel,
} from "@/features/auth/mapper";

export async function loginWithPassword(credentials: LoginRequestDto) {
  const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Login request failed: ${response.status}`);
  }

  const body = (await response.json()) as TokenResponseDto;
  return mapTokenResponseDtoToModel(body);
}

export async function getCurrentUser(token: string) {
  const response = await fetch("/api/v1/auth/me", {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Current user request failed: ${response.status}`);
  }

  const body = (await response.json()) as UserDto;
  return mapUserDtoToModel(body);
}
