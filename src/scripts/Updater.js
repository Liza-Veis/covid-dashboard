class Updater {
  constructor(covidObj, chartObj, mapObj, resetFunc, startTimeInterval) {
    this.covidObj = covidObj;
    this.chartObj = chartObj;
    this.mapObj = mapObj;
    this.resetFunc = resetFunc;
    this.TimeInterval = startTimeInterval;
    this.interval = null;
  }

  init() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(async () => {
      await this.covidObj.init();
      await this.chartObj.init();
      await this.mapObj.setData(this.covidObj.getData());
      this.resetFunc(this.covidObj, this.mapObj, this.chartObj);
    }, this.TimeInterval);
  }

  setNewInterval(interval) {
    this.TimeInterval = interval;
    this.init();
  }
}

export default Updater;
