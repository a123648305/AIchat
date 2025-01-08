import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';
import { UnoCSSRspackPlugin } from '@unocss/webpack/rspack';
import { presetAttributify } from '@unocss/preset-attributify';
import { presetUno } from '@unocss/preset-uno';
export default defineConfig({
  plugins: [pluginReact(), pluginLess()],
  tools: {
    rspack: {
      plugins: [
        UnoCSSRspackPlugin({
          presets: [presetUno(), presetAttributify()],
        }),
      ],
    },
  },
});
