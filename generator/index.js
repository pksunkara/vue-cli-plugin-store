const fs = require('fs');

module.exports = (api, options, rootOptions) => {
  // TODO: Typescript support
  // TODO: Post process lint
  // TODO: pluginOptions.store.folder? (How to add them in preset)
  // TODO: Add in modules of store/index.js (https://github.com/paulgv/vue-cli-plugin-vuex-module-generator/blob/master/generator/index.js)
  // TODO: Allow creation of individual action/mutation/getter
  // TODO: Option for constants for mutation types

  if (options.name === '') {
    api.injectImports(api.entryFile, `import store from './store'`);
    api.injectRootOptions(api.entryFile, 'store');

    api.extendPackage({
      dependencies: {
        vuex: '^3.0.1'
      }
    });

    if (options.persist) {
      api.extendPackage({
        dependencies: {
          'vuex-persistedstate': '^2.5.4'
        }
      });
    }

    api.render('./template/init');
  } else {
    if (fs.existsSync(`src/store/${options.name}.js`) || fs.existsSync(`src/store/${options.name}/index.js`)) {
      console.warn(`Module ${options.name} already exists`);
      return
    }

    api.injectImports('src/store/index.js', `import ${options.name} from './${options.name}'`);

    if (options.folder) {
      api.render({
        [`src/store/${options.name}/index.js`]: 'template/module/index.js',
        [`src/store/${options.name}/actions.js`]: 'template/module/actions.js',
        [`src/store/${options.name}/mutations.js`]: 'template/module/mutations.js',
        [`src/store/${options.name}/getters.js`]: 'template/module/getters.js',
      });
    } else {
      api.render({
        [`src/store/${options.name}.js`]: 'template/module/index.js',
      });
    }
  }

  if (api.invoking && api.hasPlugin('eslint')) {
    const lint = require('@vue/cli-plugin-eslint/lint');
    lint({ silent: true }, api);
  }
}
