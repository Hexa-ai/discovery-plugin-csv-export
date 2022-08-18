import { ChartType, DataModel, DiscoveryEvent, GTSLib, Param, Utils } from '@senx/discovery-widgets';
import { Component, Element, h, Listen, Prop, State, Watch, Host } from '@stencil/core';
@Component({
  tag: 'discovery-plugin-csv-export',
  styleUrl: 'discovery-plugin-csv-export.css',
  shadow: true,
})


export class DiscoveryPluginCsvExport {
  /**
   *
   * Tile attributes
   *
   */
  @Prop() result: DataModel | string;                 // mandatory, will handle the result of a Warp 10 script execution
  @Prop() type: ChartType;                            // optionnal, to handle the chart type if you want to handle more than one
  @Prop() options: Param | string = new Param();      // mandatory, will handle dashboard and tile option

  /**
   *
   * Inner variables
   *
   */
  @Element() el: HTMLElement;

  @State() innerOptions: Param;               // will handle merged options
  @State() innerResult: DataModel;            // will handle the parsed execution result
  @State() downloadLink: string;
  @State() buttonLabel: string;
  private innerStyles: any = {};
  /*
  * Called when the result is updated
  */
  @Watch('result') // mandatory
  updateRes(newValue: DataModel | string, oldValue: DataModel | string) {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      this.innerResult = GTSLib.getData(this.result);
      setTimeout(() => this.processTile());   // <- we will see this function later
    }
  }

  /*
  * Called when the options are updated
  */
  @Watch('options') // mandatory
  optionsUpdate(newValue: string, oldValue: string) {
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      if (!!this.options && typeof this.options === 'string') {
        this.innerOptions = JSON.parse(this.options);
      } else {
        this.innerOptions = { ...this.options as Param };
      }
      setTimeout(() => this.processTile());   // <- we will see this function later
    }
  }
  /*
  * Mandatory
  * Part of the lifecycle
  */
  componentWillLoad() {
    //Chart.register(...registerables);                                               // ChartJS specific loading
    //this.LOG = new Logger(DiscoveryPluginRadar, this.debug); // init the Discovery Logger
    // parse options
    if (typeof this.options === 'string') {
      this.innerOptions = JSON.parse(this.options);
    } else {
      this.innerOptions = this.options;
    }
    // parse result
    this.innerResult = GTSLib.getData(this.result);
  }

  /**
  * Mandatory
  * Part of the lifecycle
  */
  componentDidLoad() {
    setTimeout(() => this.processTile(), 1000);
  }

  toCSV(inputArray, separator = ",") {
    let rowsAsString = inputArray.map((row) => {
      return row.join(separator);
    })
    const csvFormat = rowsAsString.join("\n");
    return csvFormat
  }
  /**
   *
   * Handy if you want to handle Discovery events coming from other tiles
   *
   */
  @Listen('discoveryEvent', { target: 'window' })
  discoveryEventHandler(event: CustomEvent<DiscoveryEvent>) {
    const res = Utils.parseEventData(event.detail, this.innerOptions.eventHandler);
    if (res.data) {
      this.innerResult = res.data;
      setTimeout(() => this.processTile());
    }
    if (res.style) {
      this.innerStyles = { ...this.innerStyles, ...res.style as { [k: string]: string } };
    }
  }
  /**
   *
   * Tile main job
   *
   */
  processTile() {
    // Merge options
    let options = Utils.mergeDeep<Param>(this.innerOptions || {} as Param, this.innerResult.globalParams) as Param;
    this.innerOptions = { ...options };

    // Format CSV
    var csv = this.toCSV(this.innerResult.data, ',')

    var myBlob = new Blob([csv], { type: "text/csv" });

    this.downloadLink = window.URL.createObjectURL(myBlob);
    this.buttonLabel = "Download CSV file!"

  }
  /**
   *
   * Render the tile content
   *
   */
  render() {
    return (
      <Host>
        <a download="export.csv" href={this.downloadLink} class="border-gray-300 text-gray-500 flex justify-center py-2 px-3 border rounded-md shadow-sm text-sm font-medium font-sans focus:outline-none focus:ring-2 focus:ring-offset-2 has-tooltip">{this.innerOptions.button ? this.innerOptions.button.label : 'Download CSV'}</a>
      </Host>
    );
  }

}
