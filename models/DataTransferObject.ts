// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExcludeMethods<T> = Pick<T, { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]>

/**
 * Base class for data transfer objects we get from the API.
 *
 * Used to work around TypeScript's lack of object initializers.
 * See: https://github.com/microsoft/TypeScript/issues/3895#issuecomment-488355369.
 */
export abstract class DataTransferObject<T> {
  public constructor(initializer: ExcludeMethods<T>) {
    Object.assign(this, initializer)
  }
}
