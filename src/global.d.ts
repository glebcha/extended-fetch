interface LibGlobal {
  isWaitingAuth?: boolean
}

declare global {
  // eslint-disable-next-line no-var
  var ExtendedFetch: LibGlobal;

  interface globalThis {
    ExtendedFetch: LibGlobal;
  }
}

export {};
