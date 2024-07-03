export function isDebugMode(): boolean {
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("LEKKO_DEBUG") === "true"
  ) {
    return true
  }
  return typeof window === "undefined"
    ? process.env.LEKKO_DEBUG === "1"
    : "LEKKO_DEBUG" in window && window.LEKKO_DEBUG === 1
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(message?: any, ...optionalParams: any[]): void {
  if (isDebugMode()) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.log(message, ...optionalParams)
  }
}

log(
  "[lekko] Debug mode is enabled, set `LEKKO_DEBUG=false` (or unset it) in Local Storage to disable it.",
)
