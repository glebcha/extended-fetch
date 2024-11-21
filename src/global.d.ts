interface LibGlobal {
  isWaitingAuth?: boolean
}

declare global {
  var ExtendedFetch: LibGlobal;

  interface globalThis {
    ExtendedFetch: LibGlobal;
  }
}

export {};
