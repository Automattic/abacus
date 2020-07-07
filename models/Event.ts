import { ApiData } from '@/api/ApiData'
import { ExcludeMethods } from '@/types/ExcludeMethods'

/**
 * A Tracks event, typically used to define exposure to an experiment or conversion metrics.
 */
export class Event {
  /**
   * The name of the Tracks event.
   */
  public readonly event: string

  /**
   * Event properties that further constrain this event selection.
   */
  public readonly props?: { [key: string]: string | boolean }

  /**
   * Construct a new event.
   */
  constructor(data: Readonly<ExcludeMethods<Event>>) {
    Object.assign(this, data)
  }

  toApiData() {
    return {
      event: this.event,
      props: this.props,
    }
  }

  /**
   * Create an instance from raw API data (parsed JSON).
   *
   * @param apiData Raw API data.
   */
  static fromApiData(apiData: ApiData) {
    return new Event({
      event: apiData.event,
      props: apiData.props,
    })
  }
}
