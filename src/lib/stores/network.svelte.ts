let online = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

export function getNetworkState() {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => (online = true));
    window.addEventListener('offline', () => (online = false));
  }

  return {
    get online() { return online; }
  };
}

export const network = getNetworkState();
