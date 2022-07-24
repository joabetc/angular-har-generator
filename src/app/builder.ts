type Builder<T> = {
  [k in keyof T]: (arg: T[k]) => Builder<T>
} & { build(): T }

export function proxyBuilder<T>(): Builder<T> {
  let built: any = {};
  let builder = new Proxy({}, {
    get: function(_target, prop, _receiver) {
      if (prop === 'build') return () => built;
      return (x: any): any => {
        (built[prop] = x);
        return builder;
      }
    }
  });
  return builder as any;
}