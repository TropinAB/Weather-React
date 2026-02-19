import { useState, useEffect } from "react";

export function useFetch<T>(url: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null | undefined>(undefined);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active: boolean = true;
    async function fetchData() {
      try {
        if (url) {
          setLoading(true);

          const response: Response = await fetch(url);
          if (!response.ok) {
            throw new Error(
              `Ошибка ${response.status}: ${response.statusText}`,
            );
          }
          if (active) {
            const result: T = await response.json();
            active && setData(result);
          }
        }
      } catch (error) {
        active && setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [url]);

  return { loading, data, error };
}
