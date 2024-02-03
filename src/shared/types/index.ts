export * from './user';
export * from './auth';

export enum EModelName {
  USER = 'User',
  TOKEN = 'Token',
}

export enum ENodeEnv {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

export enum ETokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  VERIFY_EMAIL = 'verifyEmail',
  TOPIC_INVITE_EMAIL = 'topicInviteEmail',
}
