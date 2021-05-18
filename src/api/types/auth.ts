export type AuthMethod = {
  type: string;
  accessor: string;
  config: Record<string, unknown>;
  description: string;
  external_entropy_access: Boolean;
  local: Boolean;
  options: Record<string, unknown>;
  seal_wrap: Boolean;
  uuid: string;
}

export type AuthListAPIType = {
  data: AuthListType;
}

export type AuthListType = {
  [path: string]: AuthMethod;
}