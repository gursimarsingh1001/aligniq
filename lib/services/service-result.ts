export type ServiceResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
      details?: string[];
    };

export function success<T>(data: T): ServiceResult<T> {
  return {
    ok: true,
    data
  };
}

export function failure<T>(
  error: string,
  details?: string[]
): ServiceResult<T> {
  return {
    ok: false,
    error,
    details
  };
}
