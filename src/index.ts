// Reexport the native module. On web, it will be resolved to GoogleOneTapCmModule.web.ts
// and on native platforms to GoogleOneTapCmModule.ts
export { default } from './GoogleOneTapCmModule';
export { default as GoogleOneTapCmView } from './GoogleOneTapCmView';
export * from  './GoogleOneTapCm.types';
