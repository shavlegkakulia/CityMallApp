export function ChunkArrays<T>(iterable: T[], perChunk: number): Array<T[]> {
  if (!Array.isArray(iterable)) return [[]];
  if (!perChunk || perChunk <= 0) return [[...iterable]];

  const inputArray = [...iterable];

  const result = inputArray.reduce((resultArray: T[][], item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result;
}

export const minusMonthFromDate = (
  minusmonthcount: number = 1,
  date: Date | string | undefined = undefined,
) => {
  let _D;
  if (typeof date === 'string') {
    _D = new Date(date);
  } else if (typeof date === 'undefined') {
    _D = new Date();
  } else {
    _D = date;
  }

  _D?.setMonth(_D.getMonth() - minusmonthcount);
  return _D;
};
