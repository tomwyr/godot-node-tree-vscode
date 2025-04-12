export type Result<T> =
  | { type: "ok"; value: T }
  | { type: "err"; value: object };

export function parseResult<T extends {}>(resultString: string): Result<T>;

export function parseResult(
  resultString: string,
  options: { discardData: true }
): Result<void>;

export function parseResult<T extends {}>(
  resultString: string,
  options: ParseResultOptions = { discardData: false }
): Result<T> | Result<void> {
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
