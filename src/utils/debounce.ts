function debounceFn<T extends Function>(cb: T, wait = 20) {
  let timeoutId: ReturnType<typeof setTimeout> | number = 0;
  let callable = (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => cb(...args), wait);
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return <T>(<any>callable);
}

export default debounceFn;
