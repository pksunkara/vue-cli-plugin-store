module.exports = (api, options, rootOptions) => {
  // TODO: Typescript support
  // TODO: Post process lint
  // TODO: pluginOptions.store.folder? (How to add them in preset)
  // TODO: Allow creation of individual action/mutation/getter
  // TODO: Option for constants for mutation types

  require(`./${options.type}`)(api, options, rootOptions);
};
