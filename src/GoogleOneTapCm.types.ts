export type GoogleOneTapCmModuleEvents = {
  onLogin: (params: LoginEventPayload) => void;
  onLogout: (params: LogoutEventPayload) => void;
};

export type LoginEventPayload = {
  success: boolean;
  errorBody?: string;
} & (
  | {
      type: GoogleOneTapCmType.PUBLIC_KEY;
      successBody?: {
        publicKey: string;
      };
    }
  | {
      type: GoogleOneTapCmType.PASSWORD;
      successBody?: {
        username: string;
        password: string;
      };
    }
  | {
      type: GoogleOneTapCmType.CUSTOM;
      successBody?: {
        googleIdToken: string;
        username: string;
        displayName: string;
        profileUrl: string;
      };
    }
);

export type LogoutEventPayload = {
  success: boolean;
  errorBody?: string;
};

export enum GoogleOneTapCmType {
  PUBLIC_KEY,
  PASSWORD,
  CUSTOM,
}
