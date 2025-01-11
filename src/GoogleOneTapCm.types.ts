export type GoogleOneTapCmModuleEvents = {
  onLogin: (params: LoginEventPayload) => void;
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
      };
    }
);

export enum GoogleOneTapCmType {
  PUBLIC_KEY,
  PASSWORD,
  CUSTOM,
}
