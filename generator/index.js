const fs = require('fs');
const recast = require('recast');

module.exports = (api, options, rootOptions) => {
  // TODO: Typescript support
  // TODO: Post process lint
  // TODO: pluginOptions.store.folder? (How to add them in preset)
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
      console.warn(`\nModule ${options.name} already exists`);
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

    api.postProcessFiles(files => {
      const ast = recast.parse(files['src/store/index.js']);
      const property = recast.parse(`({${options.name}})`).program.body[0].expression.properties[0];

      recast.types.visit(ast, {
        visitNewExpression ({ node }) {
          if (node.callee.type === 'MemberExpression' && node.callee.object.name === 'Vuex' && node.callee.property.name === 'Store') {
            const options = node.arguments[0];

            if (options && options.type === 'ObjectExpression') {
              const index = options.properties.findIndex(p => p.key.name === 'modules');
              options.properties[index].value.properties.push(property);
            }
          }

          return false;
        }
      });

      files['src/store/index.js'] = recast.print(ast).code;
    });
  }
}
