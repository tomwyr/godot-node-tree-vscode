export type Result<T, E> = { type: "ok"; value: T } | { type: "err"; value: E };

export function parseResult<T extends {}, E extends {}>(
  resultString: string
): Result<T, E>;

export function parseResult<E extends {}>(
  resultString: string,
  options: { discardData: true }
): Result<void, E>;

export function parseResult<T extends {}, E extends {}>(
  resultString: string,
  options: ParseResultOptions = { discardData: false }
): Result<T, E> | Result<void, E> {
  let resultData = JSON.parse(resultString);
  if ("ok" in resultData) {
    return {
      type: "ok",
      value: options.discardData ? undefined : resultData["ok"],
    };
  }

  if ("err" in resultData) {
    return { type: "err", value: resultData["err"] };
  }

  throw new Error("Invalid data format for the expected Result type");
}

export type ParseResultOptions = {
  discardData: boolean;
};
