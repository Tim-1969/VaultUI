export type AuthMethod = {
  type: string;
  accessor: string;
  config: Record<string, unknown>;
  description: string;
  external_entropy_access: boolean;
  local: boolean;
  options: Record<string, unknown>;
  seal_wrap: boolean;
  uuid: string;
};

export type AuthListAPIType = {
  data: AuthListType;
};

export type AuthListType = {
  [path: string]: AuthMethod;
};
