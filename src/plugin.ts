import {PluginDef, PluginManager} from "@senx/discovery-widgets";
import * as pack from "./../package.json"

export default () => {
  PluginManager.getInstance().register(new PluginDef({
    type: 'csv-export',
    name: pack.name,
    tag: 'discovery-plugin-csv-export',
    author: pack.author,
    description: pack.description,
    version: pack.version,
  }));
}
