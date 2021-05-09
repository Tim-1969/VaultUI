export type TokenInfo = {
  accessor: string;
  creation_time: number;
  creation_ttl: number;
  display_name: string;
  entity_id: string;
  expire_time: string;
  explicit_max_ttl: 0;
  id: string;
  identity_policies: string[];
  issue_time: string;
  meta: any;
  num_uses: number;
  orphan: Boolean;
  path: string;
  policies: string[];
  renewable: Boolean;
  ttl: number;
}