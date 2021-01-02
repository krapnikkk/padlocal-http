import { PadLocalClientConfig, ServerConfig } from './interface';
export declare const install: (robotConfig: PadLocalClientConfig, serverConfig: ServerConfig) => Promise<void>;
export declare const logout: () => void;
