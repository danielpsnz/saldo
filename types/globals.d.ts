export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      household: string;
      preferred_currency: string;
      preferred_language: string;
      country?: string;
      date_format: string;
    };
  }
}
