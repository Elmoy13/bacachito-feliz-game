/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_COMING_SOON: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_PRICE_DAILY: string;
  readonly VITE_PRICE_WEEKLY: string;
  readonly VITE_PRICE_MONTHLY: string;
  readonly VITE_PRICE_QUARTERLY: string;
  readonly VITE_PRICE_YEARLY: string;
  readonly VITE_PRICE_LIFETIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
