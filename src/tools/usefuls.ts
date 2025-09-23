export const findIdx = (arr: any, name: string) => {
	const index = arr.findIndex((object: any) => {
		return object.name === name;
	});
	return index;
}

export const sleep = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const groupByProperty = <T, K extends string | number | symbol>(
  items: T[],
  keySelector: (item: T) => K
): Record<K, T[]> => {
  return items.reduce((acc, item) => {
    const key = keySelector(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
};