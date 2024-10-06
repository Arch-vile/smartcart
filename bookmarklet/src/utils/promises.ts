
export function promiseOf<T>(value: T): Promise<T> {
 return new Promise<T>(resolve => resolve(value))
}
