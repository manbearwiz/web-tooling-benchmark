import { createFsFromVolume, Volume } from "memfs";
import backbone from "../npm/backbone@1.5.0/backbone.js?raw";
import bootstrap from "../npm/bootstrap@5.3.2/dist/css/bootstrap.css?raw";
import foundation from "../npm/foundation-sites@6.8.1/dist/css/foundation.css?raw";
import jquery from "../npm/jquery@3.7.1/dist/jquery.js?raw";
import coffeescript from "../third_party/coffeescript-lexer-2.7.0.coffee?raw";
import lodash from "../npm/lodash@4.17.21/core.js?raw";
import preact from "../npm/preact@8.2.5/dist/preact.js?raw";
import preactMap from "../npm/preact@8.2.5/dist/preact.min.js.map?raw";
import redux from "../npm/redux@3.7.2/dist/redux.js?raw";
import reduxMin from "../npm/redux@3.7.2/dist/redux.min.js?raw";
import source from "../npm/source-map@0.5.7/dist/source-map.min.js.map?raw";
import speedometer from "../third_party/speedometer-es2015-test-2.0.js?raw";
import todomvcApp from "../third_party/todomvc/react/app.jsx?raw";
import todomvcFooter from "../third_party/todomvc/react/footer.jsx?raw";
import todomvcItem from "../third_party/todomvc/react/todoItem.jsx?raw";
import todomvcTsNg from "../third_party/todomvc/typescript-angular.ts?raw";
import underscore from "../npm/underscore@1.8.3/underscore.js?raw";
import underscoreMap from "../npm/underscore@1.8.3/underscore-min.map?raw";
import vue from "../npm/vue@2.7.15/dist/vue.runtime.esm.js?raw";

const json = {
  "./backbone.js": backbone,
  "./bootstrap.css": bootstrap,
  "./foundation.css": foundation,
  "./jquery.js":jquery,
  "./coffeescript-lexer.coffee": coffeescript,
  "./lodash.core.js": lodash,
  "./preact.js": preact,
  "./preact.js.map": preactMap,
  "./redux.js": redux,
  "./redux.min.js": reduxMin,
  "./source-map.min.js.map": source,
  "./speedometer-es2015-test-2.0.js": speedometer,
  "./todomvc/react/app.jsx": todomvcApp,
  "./todomvc/react/footer.jsx": todomvcFooter,
  "./todomvc/react/todoItem.jsx": todomvcItem,
  "./todomvc/typescript-angular.ts": todomvcTsNg,
  "./underscore.js": underscore,
  "./underscore.min.js.map":underscoreMap,
  "./vue.runtime.esm-nobuble.js": vue,
};
const vol = Volume.fromJSON(json, "third_party");

const fs = createFsFromVolume(vol);

export default fs;
