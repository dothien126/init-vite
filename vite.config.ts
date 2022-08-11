import type { UserConfig, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { loadEnv } from 'vite';
import { wrapperEnv } from './src/utils/readFileEnv'
import * as path from 'path';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // Type read by loadEnv is a string. Converted to boolean type
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE } = viteEnv;

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      https: false,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
    },

    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    plugins: [vue(), viteEnv],
  };
};
