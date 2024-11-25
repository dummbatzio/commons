declare module "#auth-utils" {
  interface User {
    id: string;
    username: string;
    email: string;
  }

  interface UserSession {
    user: User;
    accessToken: string;
    secure: SecureSessionData;
  }

  interface SecureSessionData {
    accessToken: string;
    refreshToken: string;
  }
}

export {};
