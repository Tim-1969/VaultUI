export type UserType = {
  token_bound_cidrs: string[];
  token_explicit_max_ttl: number;
  token_max_ttl: number;
  token_no_default_policy: boolean;
  token_num_uses: number;
  token_period: number;
  token_policies: string[];
  token_ttl: number;
  token_type: string;
};

export type UserTypeAPIResp = {
  data: UserType;
};
