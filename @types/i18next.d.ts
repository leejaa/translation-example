import { resources, defaultNS } from "../i18n";

type ResourcesType = typeof resources["en"];

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources["ko"];
  }
}