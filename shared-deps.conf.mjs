/**
 * @type {import('self-hosted-shared-dependencies').BuildOpts}
 */
const config = {
  packages: [
    {
      name: "backbone",
      include: ["backbone.js"],
      versions: ["1.5.0"],
    },
    {
      name: "bootstrap",
      include: ["dist/css/bootstrap.css"],
      versions: ["5.3.2"],
    },
    {
      name: "foundation-sites",
      include: ["dist/css/foundation.css"],
      versions: ["6.8.1"],
    },
    {
      name: "jquery",
      include: ["dist/jquery.js"],
      versions: ["3.7.1"],
    },
    {
      name: "lodash",
      include: ["core.js"],
      versions: ["4.17.21"],
    },
    {
      name: "source-map",
      include: ["dist/source-map.min.js.map"],
      versions: ["0.5.7"],
    },
    {
      name: "preact",
      include: ["dist/preact.js", "dist/preact.min.js.map"],
      versions: ["8.2.5"],
    },
    {
      name: "redux",
      include: ["dist/redux.js", "dist/redux.min.js"],
      versions: ["3.7.2"],
    },
    {
      name: "underscore",
      include: ["underscore.js", "underscore-min.map"],
      versions: ["1.8.3"],
    },
    {
      name: "vue",
      include: ["dist/vue.runtime.esm.js"],
      versions: ["2.7.15"],
    },
  ],
};

export default config;
