/** Fired when login / logout / session changes so guards re-read localStorage. */
export const PORTFOLIO_AUTH_CHANGED = 'portfolio-auth-changed';

export function emitPortfolioAuthChanged() {
  window.dispatchEvent(new Event(PORTFOLIO_AUTH_CHANGED));
}
