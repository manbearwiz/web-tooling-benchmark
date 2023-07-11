const { createFsFromVolume, Volume } = require("memfs");

const json = {
  "./angular-material-1.1.8.css": require("../third_party/angular-material-1.1.8.css?raw"),
  "./backbone-1.1.0.js": require("../third_party/backbone-1.1.0.js?raw"),
  "./bootstrap-4.0.0.css": require("../third_party/bootstrap-4.0.0.css?raw"),
  "./foundation-6.4.2.css": require("../third_party/foundation-6.4.2.css?raw"),
  "./jquery-3.2.1.js": require("../third_party/jquery-3.2.1.js?raw"),
  "./coffeescript-lexer-2.0.1.coffee": require("../third_party/coffeescript-lexer-2.0.1.coffee?raw"),
  "./lodash.core-4.17.4.js": require("../third_party/lodash.core-4.17.4.js?raw"),
  "./lodash.min-4.17.4.js.map": require("../third_party/lodash.min-4.17.4.js.map?raw"),
  "./mootools-core-1.6.0.js": require("../third_party/mootools-core-1.6.0.js?raw"),
  "./preact-8.2.5.js": require("../third_party/preact-8.2.5.js?raw"),
  "./preact-8.2.5.js.map": require("../third_party/preact-8.2.5.js.map?raw"),
  "./redux.min-3.7.2.js": require("../third_party/redux.min-3.7.2.js?raw"),
  "./source-map.min-0.5.7.js.map": require("../third_party/source-map.min-0.5.7.js.map?raw"),
  "./speedometer-es2015-test-2.0.js": require("../third_party/speedometer-es2015-test-2.0.js?raw"),
  "./todomvc/react/app.jsx": require("../third_party/todomvc/react/app.jsx?raw"),
  "./todomvc/react/footer.jsx": require("../third_party/todomvc/react/footer.jsx?raw"),
  "./todomvc/react/todoItem.jsx": require("../third_party/todomvc/react/todoItem.jsx?raw"),
  "./todomvc/typescript-angular.ts": require("../third_party/todomvc/typescript-angular.ts?raw"),
  "./underscore-1.8.3.js": require("../third_party/underscore-1.8.3.js?raw"),
  "./underscore.min-1.8.3.js.map": require("../third_party/underscore.min-1.8.3.js.map?raw"),
  "./vue.runtime.esm-nobuble-2.4.4.js": require("../third_party/vue.runtime.esm-nobuble-2.4.4.js?raw")
};
const vol = Volume.fromJSON(json, "third_party");

const fs = createFsFromVolume(vol);

module.exports = fs;
