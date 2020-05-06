export interface Event {
  /**
   * The name of the Tracks event.
   */
  event: string

  /**
   * Event properties that further constrain this event selection.
   */
  props?: { [key: string]: string }
}
