// PLEASE DO NOT EDIT, file is generated
export const manifest = [
  ['/', () => import('../../routes/index.svelte')],
  ['/static', () => import('../../routes/static/index.svelte')],
  ['/static/static', () => import('../../routes/static/static.svelte')],
  ['/static/:arg1', () => import('../../routes/static/[arg1].svelte')],
  ['/:arg1', () => import('../../routes/[arg1]/index.svelte')],
  ['/:arg1/static', () => import('../../routes/[arg1]/static.svelte')],
  ['/:arg1/:arg2', () => import('../../routes/[arg1]/[arg2].svelte')]
];