export const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
} as const;


export type TokenTypes = typeof tokenTypes[keyof typeof tokenTypes];