const fs = require('fs');

module.exports = (api, options, rootOptions) => {
  // TODO: Typescript support
  // TODO: Post process lint
  // TODO: Does any config in vue.config.js reduce the prompts? (Mostly for folder option now)

  if (options.name === '') {
    api.injectImports(api.entryFile, `import store from '@/store'`);
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
    // TODO: import Hello and add in modules of store/index.js
    // TODO: Allow creation of individual action/mutation/getter
    // TODO: Option for constants for mutation types

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
}
