import { useEffect, useState } from "react";
import * as Admin from "../api/admin";

export function useAdminList(resource: string, params: Admin.ListParams = {}) {
  const [data, setData] = useState<{ results: any[]; next_cursor: string | null; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Admin.list(resource, params)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [resource, JSON.stringify(params)]);

  return { data, loading, error };
}
