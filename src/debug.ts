export function isDebugMode(): boolean {
  let lekkoDebug: unknown
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("LEKKO_DEBUG") === "true"
  ) {
    lekkoDebug = localStorage.getItem("LEKKO_DEBUG")
  } else if (typeof window !== "undefined") {
    lekkoDebug = "LEKKO_DEBUG" in window ? window.LEKKO_DEBUG : undefined
  } else {
    lekkoDebug = process.env.LEKKO_DEBUG
  }
  return lekkoDebug === "true" || lekkoDebug === "1" || lekkoDebug === 1
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logDebug(message?: any, ...optionalParams: any[]): void {
  if (isDebugMode()) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.log(message, ...optionalParams)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logInfo(message?: any, ...optionalParams: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  console.info(message, ...optionalParams)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logError(message?: any, ...optionalParams: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  console.error(message, ...optionalParams)
}

interface LekkoDebugGlobal {
  initialized?: boolean
}

const _global = globalThis as LekkoDebugGlobal

if (_global.initialized === undefined || !_global.initialized) {
  let howToDisable = "unset `LEKKO_DEBUG` in Local Storage"
  let howToEnable = "Set 'LEKKO_DEBUG=true' in Local Storage"
  if (typeof window === "undefined") {
    howToDisable = "unset `LEKKO_DEBUG` environment variable"
    howToEnable = "set `LEKKO_DEBUG=true` environment variable"
  }
  logDebug(`[lekko] Debug mode is enabled, ${howToDisable} to disable it.`)
  if (!isDebugMode()) {
    logInfo(`[lekko] Connecting... ${howToEnable} to see more logs.`)
  }
  _global.initialized = true
}
