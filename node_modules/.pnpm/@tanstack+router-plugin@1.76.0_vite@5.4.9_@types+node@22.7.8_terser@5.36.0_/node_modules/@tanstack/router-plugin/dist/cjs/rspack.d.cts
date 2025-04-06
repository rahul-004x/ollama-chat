import { configSchema, Config } from './core/config.cjs';
/**
 * @example
 * ```ts
 * export default defineConfig({
 *   // ...
 *   tools: {
 *     rspack: {
 *       plugins: [TanStackRouterGeneratorRspack()],
 *     },
 *   },
 * })
 * ```
 */
declare const TanStackRouterGeneratorRspack: (options?: Partial<{
    routeFileIgnorePrefix: string;
    routesDirectory: string;
    generatedRouteTree: string;
    quoteStyle: "single" | "double";
    semicolons: boolean;
    disableTypes: boolean;
    addExtensions: boolean;
    disableLogging: boolean;
    disableManifestGeneration: boolean;
    apiBase: string;
    routeTreeFileHeader: string[];
    routeTreeFileFooter: string[];
    indexToken: string;
    routeToken: string;
    enableRouteGeneration?: boolean | undefined;
    virtualRouteConfig?: import('@tanstack/virtual-file-routes').VirtualRootRoute | undefined;
    routeFilePrefix?: string | undefined;
    routeFileIgnorePattern?: string | undefined;
    autoCodeSplitting?: boolean | undefined;
    experimental?: {
        enableCodeSplitting?: boolean | undefined;
    } | undefined;
}> | undefined) => _rspack_core_dist_config_zod.RspackPluginInstance;
/**
 * @example
 * ```ts
 * export default defineConfig({
 *   // ...
 *   tools: {
 *     rspack: {
 *       plugins: [TanStackRouterCodeSplitterRspack()],
 *     },
 *   },
 * })
 * ```
 */
declare const TanStackRouterCodeSplitterRspack: (options?: Partial<{
    routeFileIgnorePrefix: string;
    routesDirectory: string;
    generatedRouteTree: string;
    quoteStyle: "single" | "double";
    semicolons: boolean;
    disableTypes: boolean;
    addExtensions: boolean;
    disableLogging: boolean;
    disableManifestGeneration: boolean;
    apiBase: string;
    routeTreeFileHeader: string[];
    routeTreeFileFooter: string[];
    indexToken: string;
    routeToken: string;
    enableRouteGeneration?: boolean | undefined;
    virtualRouteConfig?: import('@tanstack/virtual-file-routes').VirtualRootRoute | undefined;
    routeFilePrefix?: string | undefined;
    routeFileIgnorePattern?: string | undefined;
    autoCodeSplitting?: boolean | undefined;
    experimental?: {
        enableCodeSplitting?: boolean | undefined;
    } | undefined;
}> | undefined) => _rspack_core_dist_config_zod.RspackPluginInstance;
/**
 * @example
 * ```ts
 * export default defineConfig({
 *   // ...
 *   tools: {
 *     rspack: {
 *       plugins: [TanStackRouterRspack()],
 *     },
 *   },
 * })
 * ```
 */
declare const TanStackRouterRspack: (options?: Partial<{
    routeFileIgnorePrefix: string;
    routesDirectory: string;
    generatedRouteTree: string;
    quoteStyle: "single" | "double";
    semicolons: boolean;
    disableTypes: boolean;
    addExtensions: boolean;
    disableLogging: boolean;
    disableManifestGeneration: boolean;
    apiBase: string;
    routeTreeFileHeader: string[];
    routeTreeFileFooter: string[];
    indexToken: string;
    routeToken: string;
    enableRouteGeneration?: boolean | undefined;
    virtualRouteConfig?: import('@tanstack/virtual-file-routes').VirtualRootRoute | undefined;
    routeFilePrefix?: string | undefined;
    routeFileIgnorePattern?: string | undefined;
    autoCodeSplitting?: boolean | undefined;
    experimental?: {
        enableCodeSplitting?: boolean | undefined;
    } | undefined;
}> | undefined) => _rspack_core_dist_config_zod.RspackPluginInstance;
export default TanStackRouterRspack;
export { configSchema, TanStackRouterRspack, TanStackRouterGeneratorRspack, TanStackRouterCodeSplitterRspack, };
export type { Config };
