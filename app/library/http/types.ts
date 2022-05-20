type Extension = {
  plugin: (Vue: Vue, params: InstallParams) => void;
  options?: Options;
};

type Options = {
  addTrailingSlashInterceptor?: boolean;
  httpRoot?: string;
};

export type DittoHttp = {
  addHeader: (key: string, value: string | number) => void;
  get: (endpoint: string, params: { [key: string]: any }) => Promise<object>;
  getUrl: (
    endpoint: string,
    params: { [key: string]: any },
    useRandomString: boolean
  ) => string;
  patch: (
    endpoint: string,
    params: { [key: string]: any },
    data: unknown
  ) => Promise<void>;
  post: (
    endpoint: string,
    params: { [key: string]: any },
    data: unknown
  ) => Promise<void>;
  remove: (endpoint: string, params: { [key: string]: any }) => Promise<void>;
  setRoot: (url: string) => void;
};

export type InstallParams = {
  extensions?: Extension[];
  options?: Options;
};

