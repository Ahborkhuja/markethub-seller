import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // Disable prerendering for parameterized routes (e.g. `:id`).
    // Prerendering requires `getPrerenderParams`, otherwise SSR build fails.
    renderMode: RenderMode.Server,
  }
];
