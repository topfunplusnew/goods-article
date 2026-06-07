export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface UserDto {
  id: number;
  username: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenResponseDto {
  access_token: string;
  token_type: string;
  user: UserDto;
}
