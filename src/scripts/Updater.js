class Updater {
  constructor(covidObj, mapObj, graphObj, resetFunc, startTimeInterval) {
    this.covidObj = covidObj;
    this.mapObj = mapObj;
    this.graphObj = graphObj;
    this.resetFunc = resetFunc;
    this.TimeInterval = startTimeInterval;
    this.interval = null;
  }

  init() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(async () => {
      await this.covidObj.init();
      await this.mapObj.setData(this.covidObj.getData());
      this.resetFunc(this.covidObj, this.mapObj, this.graphObj);
    }, this.TimeInterval * 60000 * 60);
  }

  setNewInterval(interval) {
    this.TimeInterval = interval;
    this.init();
  }
}

export default Updater;
