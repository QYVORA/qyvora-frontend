import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The PWA service is a module singleton, so every test reloads the module and
 * stubs the browser APIs it owns (service worker, matchMedia, install prompt).
 */

interface FakeRegistration extends EventTarget {
  waiting: EventTarget | null;
  installing: EventTarget | null;
  update: ReturnType<typeof vi.fn>;
  pushManager: {
    getSubscription: ReturnType<typeof vi.fn>;
    subscribe: ReturnType<typeof vi.fn>;
  };
}

function createRegistration(overrides: Partial<FakeRegistration> = {}): FakeRegistration {
  return Object.assign(new EventTarget(), {
    waiting: null,
    installing: null,
    update: vi.fn(),
    pushManager: {
      getSubscription: vi.fn().mockResolvedValue(null),
      subscribe: vi.fn().mockResolvedValue(null),
    },
    ...overrides,
  }) as FakeRegistration;
}

function stubServiceWorker(register: ReturnType<typeof vi.fn>, controller: unknown = null) {
  const listeners = new Map<string, EventListener[]>();
  const container = {
    controller,
    register,
    addEventListener: (type: string, listener: EventListener) => {
      listeners.set(type, [...(listeners.get(type) ?? []), listener]);
    },
    removeEventListener: (type: string, listener: EventListener) => {
      listeners.set(type, (listeners.get(type) ?? []).filter((l) => l !== listener));
    },
    dispatch: (type: string) => (listeners.get(type) ?? []).forEach((l) => l(new Event(type))),
  };
  Object.defineProperty(navigator, 'serviceWorker', {
    value: container,
    configurable: true,
    writable: true,
  });
  return container;
}

function stubMatchMedia(standalone: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('display-mode: standalone') ? standalone : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function createInstallPromptEvent(outcome: 'accepted' | 'dismissed') {
  const event = new Event('beforeinstallprompt') as Event & {
    prompt: ReturnType<typeof vi.fn>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  };
  event.prompt = vi.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome, platform: 'web' });
  return event;
}

let register: ReturnType<typeof vi.fn>;

async function loadPwa(env: Record<string, string> = { VITE_ENABLE_SW_IN_DEV: 'true' }) {
  vi.resetModules();
  Object.entries(env).forEach(([key, value]) => vi.stubEnv(key, value));
  return import('../pwa');
}

beforeEach(() => {
  register = vi.fn().mockResolvedValue(createRegistration());
  stubServiceWorker(register);
  stubMatchMedia(false);
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('initPWA', () => {
  it('registers the service worker at the site root scope', async () => {
    const { initPWA } = await loadPwa();
    initPWA();
    expect(register).toHaveBeenCalledWith('/sw.js', { scope: '/' });
  });

  it('registers only once across repeated calls', async () => {
    const { initPWA } = await loadPwa();
    initPWA();
    initPWA();
    expect(register).toHaveBeenCalledTimes(1);
  });

  it('stays unregistered in dev unless explicitly enabled', async () => {
    const { initPWA } = await loadPwa({ VITE_ENABLE_SW_IN_DEV: '' });
    initPWA();
    expect(register).not.toHaveBeenCalled();
  });

  it('swallows registration failures', async () => {
    register.mockRejectedValue(new Error('blocked'));
    const { initPWA, getRegistration } = await loadPwa();
    initPWA();
    await expect(getRegistration()).resolves.toBeNull();
  });
});

describe('install prompt', () => {
  it('captures beforeinstallprompt so the UI can react to it', async () => {
    const { initPWA, getInstallState } = await loadPwa();
    initPWA();
    expect(getInstallState().canPrompt).toBe(false);

    window.dispatchEvent(createInstallPromptEvent('accepted'));
    expect(getInstallState().canPrompt).toBe(true);
  });

  it('resolves the accepted outcome and marks the app as installed', async () => {
    const { initPWA, getInstallState, promptInstall } = await loadPwa();
    initPWA();
    window.dispatchEvent(createInstallPromptEvent('accepted'));

    await expect(promptInstall()).resolves.toBe('accepted');

    const state = getInstallState();
    expect(state.canPrompt).toBe(false);
    expect(state.isStandalone).toBe(true);
  });

  it('reports unavailable when the browser offers no prompt', async () => {
    const { initPWA, promptInstall } = await loadPwa();
    initPWA();
    await expect(promptInstall()).resolves.toBe('unavailable');
  });

  it('clears the captured prompt after appinstalled', async () => {
    const { initPWA, getInstallState } = await loadPwa();
    initPWA();
    window.dispatchEvent(createInstallPromptEvent('accepted'));
    window.dispatchEvent(new Event('appinstalled'));

    const state = getInstallState();
    expect(state.canPrompt).toBe(false);
    expect(state.isStandalone).toBe(true);
  });

  it('detects an already installed window', async () => {
    stubMatchMedia(true);
    const { initPWA, getInstallState } = await loadPwa();
    initPWA();
    expect(getInstallState().isStandalone).toBe(true);
  });

  it('notifies subscribers of prompt availability', async () => {
    const { initPWA, subscribeToInstallState } = await loadPwa();
    initPWA();
    const listener = vi.fn();
    const unsubscribe = subscribeToInstallState(listener);

    window.dispatchEvent(createInstallPromptEvent('dismissed'));
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ canPrompt: true }));

    unsubscribe();
    listener.mockClear();
    window.dispatchEvent(new Event('appinstalled'));
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('update lifecycle', () => {
  it('announces a worker that is already waiting', async () => {
    register.mockResolvedValue(createRegistration({ waiting: new EventTarget() }));
    const container = stubServiceWorker(register, {});

    const { initPWA, getUpdateAvailable } = await loadPwa();
    initPWA();
    await Promise.resolve();
    await Promise.resolve();

    expect(getUpdateAvailable()).toBe(true);
    expect(container.controller).toBeTruthy();
  });

  it('announces an update once the new worker finishes installing', async () => {
    const registration = createRegistration();
    register.mockResolvedValue(registration);
    stubServiceWorker(register, {});

    const { initPWA, getUpdateAvailable } = await loadPwa();
    initPWA();
    await Promise.resolve();
    await Promise.resolve();

    const installing = new EventTarget() as EventTarget & { state: string };
    installing.state = 'installing';
    registration.installing = installing;
    registration.dispatchEvent(new Event('updatefound'));
    installing.state = 'installed';
    installing.dispatchEvent(new Event('statechange'));

    expect(getUpdateAvailable()).toBe(true);
  });

  it('does not announce the very first install as an update', async () => {
    const registration = createRegistration();
    register.mockResolvedValue(registration);
    stubServiceWorker(register, null);

    const { initPWA, getUpdateAvailable } = await loadPwa();
    initPWA();
    await Promise.resolve();
    await Promise.resolve();

    const installing = new EventTarget() as EventTarget & { state: string };
    installing.state = 'installed';
    registration.installing = installing;
    registration.dispatchEvent(new Event('updatefound'));
    installing.dispatchEvent(new Event('statechange'));

    expect(getUpdateAvailable()).toBe(false);
  });

  it('tells the waiting worker to activate when the update is applied', async () => {
    const waiting = new EventTarget() as EventTarget & { postMessage: ReturnType<typeof vi.fn> };
    waiting.postMessage = vi.fn();
    register.mockResolvedValue(createRegistration({ waiting }));

    const { initPWA, applyUpdate } = await loadPwa();
    initPWA();
    await applyUpdate();

    expect(waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
  });
});

describe('connectivity', () => {
  it('mirrors online/offline events to subscribers', async () => {
    const { isOnline, subscribeToOnlineState } = await loadPwa();
    const listener = vi.fn();
    const unsubscribe = subscribeToOnlineState(listener);

    expect(isOnline()).toBe(true);

    window.dispatchEvent(new Event('offline'));
    expect(listener).toHaveBeenLastCalledWith(false);

    window.dispatchEvent(new Event('online'));
    expect(listener).toHaveBeenLastCalledWith(true);

    unsubscribe();
    listener.mockClear();
    window.dispatchEvent(new Event('offline'));
    expect(listener).not.toHaveBeenCalled();
  });
});