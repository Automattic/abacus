/**
 * Allows to create a type with all the same properties as `T`, excluding methods.
 */
export type ExcludeMethods<T> = Pick<T, { [K in keyof T]: T[K] extends (_: unknown) => unknown ? never : K }[keyof T]>
