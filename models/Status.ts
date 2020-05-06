/**
 * The status of an experiment. Status descriptions:
 *
 * - `staging`: the default/initial status. No users are allocated to the experiment,
 *   but it may be used for internal testing of the variations.
 *
 * - `running`: the experiment is running and users are allocated to variations.
 *
 * - `completed`: the experiment finished running. New users are no longer allocated
 *   to the test variations, but already-allocated users still see their assigned
 *   variation.
 *
 * - `disabled`: the experiment is no longer active and isn't used by the framework.
 *   Therefore, everyone sees the control variation, unless the test variation has
 *   been deployed.
 *
 * The following status transitions are allowed:
 *
 * - `staging`:
 *   + To `running`: If the current datetime is `start_datetime` and the experiment is
 *     valid.
 *   + To `disabled`: If the owner decides to discard the experiment and not launch it.
 *
 * - `running`:
 *   + To `completed`: If the current datetime is `end_datetime`.
 *   + To `disabled`: If the owner decides to immediately stop the experiment and skip
 *     the `completed` status.
 *
 * - `completed`:
 *   + To `disabled`: If the current datetime is two weeks after the `end_datetime`, or
 *     if the owner decides to immediately disable the experiment.
 *
 * - `disabled`: No further transitions are allowed.
 *
 * Permitted field changes by status:
 * - `staging`: Any changes that don't violate field validation constraints
 *   (nullability, value range, etc.).
 *
 * - `running`:
 *   + Metadata updates to `description` and `owner_login`.
 *   + Assigning more secondary metrics.
 *
 *   All other updates are prohibited, as they change the experiment's semantics
 *   (e.g., variation/segment allocation changes).
 *
 * - `completed`:
 *   + Metadata updates to `description` and `owner_login`.
 *   + Assigning more secondary metrics.
 *   + Populating the conclusion fields (`end_reason`, `conclusion_url`, and
 *     `deployed_variation_id`).
 *
 *   As with `running`, all other updates are prohibited.
 *
 * - `disabled`: Same as `completed`.
 */
export enum Status {
  Staging = 'staging',
  Running = 'running',
  Completed = 'completed',
  Disabled = 'disabled',
}
