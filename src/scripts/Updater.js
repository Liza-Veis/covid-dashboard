class Updater {
  constructor(covidObj, chartObj, mapObj, startTimeInterval) {
    this.covidObj = covidObj;
    this.chartObj = chartObj;
    this.mapObj = mapObj;
    this.startTimeInterval = startTimeInterval;
    this.interval = null;
  }

  init() {
    this.interval = setInterval(async () => {
      await this.covidObj.init();
      await this.chartObj.init();
      // await this.mapObj.update(this.covidObj.getData());
    }, this.startTimeInterval);
  }
}

export default Updater;
