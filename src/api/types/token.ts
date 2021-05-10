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
  meta: Record<string, string>;
  num_uses: number;
  orphan: boolean;
  path: string;
  policies: string[];
  renewable: boolean;
  ttl: number;
}