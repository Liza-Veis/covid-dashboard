import DataChart from '../scripts/dataChart'

describe('chart', () => {
  let obj;
  let result;
  const mockSuccessResponse = {};
  const mockJsonPromise = Promise.resolve(mockSuccessResponse);
  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  });
  global.fetch = jest.fn(() => mockFetchPromise);
  beforeEach(async () => {
    obj = new DataChart(document.createElement('canvas'));
    result = await obj.getGlobalData();
  })
  it('should return data', () => {
    
    expect(result).toBeDefined();
  });
  it('should be object instance', () => {
    expect(result).toBeInstanceOf(Object);
  });
  it('should countains cases, deaths, recovered props', () => {
    expect.objectContaining({
      'cases': expect.any(obj),
      'deaths': expect.any(obj),
      'recovered': expect.any(obj),
    });
  });
  it('chart should be null before init', () => {
    expect(obj.chart).toBeNull();
  })
  it('should not return anything', () => {
    expect(obj.resetCanvas()).toBe(undefined);
  })
});
