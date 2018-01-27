export function getPatch(prev, next): object {
  const nextKeys = Object.keys(next);
  const patch = {};

  nextKeys.forEach(k => {
    if (prev[k] !== next[k]) {
      patch[k] = next[k];
    }
  });

  return patch;
}
