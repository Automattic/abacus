/**
 * The platform where the experiment is running.
 * - `calypso`: The experiment is being run on the front-end Calypso interface,
 *   WordPress.com. Account sign-up and site management design experiments are
 *   likely run here.
 * - `wpcom`: The experiment is being run on the back-end, like APIs which are
 *   usually written in PHP. Email and landing pages experiments are likely run here.
 */
export enum Platform {
  Calypso = 'calypso',
  Wpcom = 'wpcom',
}
