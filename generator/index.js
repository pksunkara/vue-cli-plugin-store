module.exports = (api, options, rootOptions) => {
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
    api.render({
      'module/index.js': `src/store/${options.name}.js`
    });
  }
}
