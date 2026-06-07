import type {
  TokenResponseDto,
  UserDto,
} from "@/features/auth/contracts";
import type {
  AuthSession,
  AuthUser,
} from "@/features/auth/model";

export function mapUserDtoToModel(dto: UserDto): AuthUser {
  return {
    id: dto.id,
    username: dto.username,
    isActive: dto.is_active,
    isSuperuser: dto.is_superuser,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapTokenResponseDtoToModel(dto: TokenResponseDto): AuthSession {
  return {
    accessToken: dto.access_token,
    tokenType: dto.token_type,
    user: mapUserDtoToModel(dto.user),
  };
}
