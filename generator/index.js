const fs = require('fs');
const recast = require('recast');

// eslint-disable-next-line no-unused-vars
module.exports = (api, options, rootOptions) => {
  // TODO: Typescript support
  // TODO: Post process lint
  // TODO: pluginOptions.store.folder? (How to add them in preset)
  // TODO: Allow creation of individual action/mutation/getter
  // TODO: Option for constants for mutation types

  if (options.type === 'init') {
    api.injectImports(api.entryFile, 'import store from \'./store\'');
    api.injectRootOptions(api.entryFile, 'store');

    api.extendPackage({
      dependencies: {
        vuex: '^3.0.1',
      },
    });

    if (options.persist) {
      api.extendPackage({
        dependencies: {
          'vuex-persistedstate': '^2.5.4',
        },
      });
    }

    api.render('./template/init');
  } else {
    if (fs.existsSync(`src/store/${options.name}.js`) || fs.existsSync(`src/store/${options.name}/index.js`)) {
      // eslint-disable-next-line no-console
      console.warn(`\nModule ${options.name} already exists`);
      return;
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

    api.postProcessFiles((files) => {
      const ast = recast.parse(files['src/store/index.js']);
      const property = recast.parse(`({${options.name}})`).program.body[0].expression.properties[0];

      recast.types.visit(ast, {
        visitNewExpression({ node }) {
          if (node.callee.type === 'MemberExpression' && node.callee.object.name === 'Vuex' && node.callee.property.name === 'Store') {
            const opts = node.arguments[0];

            if (opts && opts.type === 'ObjectExpression') {
              const index = opts.properties.findIndex(p => p.key.name === 'modules');
              opts.properties[index].value.properties.push(property);
            }
          }

          return false;
        },
      });

      // eslint-disable-next-line no-param-reassign
      files['src/store/index.js'] = recast.print(ast).code;
    });
  }
};
