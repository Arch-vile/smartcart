export function weightedAverage(from: number[]): number {
  const result = from.reduce((acc, curr, index) => {
    acc.sum += curr * (index + 1);
    acc.count += (index + 1);
    return acc;
  }, { sum: 0, count: 0 });
  return result.sum / result.count;
}
