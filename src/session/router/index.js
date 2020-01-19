import { manifest } from '@tw/manifest';
import { observable } from 'observable';
import { parsePath } from 'url/path';
import { parseQuery } from 'url/query';
import { assert, ParseError } from 'errors';
import { pipeline } from 'pipeline';
import App from './app.svelte';

window.history.scrollRestoration = 'manual';

let id = 0;
const scrollHistory = {};

function scrollState() {
  return {
    x: pageXOffset,
    y: pageYOffset,
  };
}

const history = observable({
  location: window.location,
  scrollState: scrollState(),
});

let app;

// state is not passed further, just placeholder in case we'll need to use it
function historyPush(path, state = {}) {
  scrollHistory[id] = scrollState(); // store current scroll state
  id += 1; // increment page id
  const url = new URL(path, window.location.origin);
  window.history.pushState({ ...state, id }, null, url);
  history.set({
    location: window.location,
    scrollState: { x: 0, y: 0 },
  });
}

function historyReplace(path, state = {}) {
  scrollHistory[id] = scrollState();
  const url = new URL(path, window.location.origin);
  window.history.replaceState({ ...state, id }, null, url);
  history.set({
    location: window.location,
    scrollState: { x: 0, y: 0 },
  });
}

function navigate(evt, state = {}) {
  const href = evt.currentTarget.href;
  const target = evt.currentTarget.getAttribute('target');
  if (href && target !== '_blank' && evt.button === 0 && !evt.metaKey) {
    evt.preventDefault();
    historyPush(href, state);
  }
}

function navigateReplace(evt, state = {}) {
  const href = evt.currentTarget.href;
  const target = evt.currentTarget.getAttribute('target');
  if (href && target !== '_blank' && evt.button === 0 && !evt.metaKey) {
    evt.preventDefault();
    historyReplace(href, state);
  }
}

window.addEventListener('popstate', evt => {
  history.set({
    location: window.location,
    scrollState: scrollState[evt.state?.id] ?? { x: 0, y: 0 },
  });
});

function matchRoute(location) {
  const pathname = location.pathname;
  const query = parseQuery(location.search);
  for (const [route, importFn] of manifest) {
    try {
      const path = parsePath(pathname, route);
      return { route, path, query, importFn };
    } catch (err) {
      assert(err instanceof ParseError, err);
    }
  }
  return {};
}

const historian = pipeline([
  ({ location }) => matchRoute(location),
  async ({ scrollState }, { route, path, query, importFn }) => {
    if (importFn) {
      try {
        const Module = await importFn();
        await Module.preload?.({ page: { route, path, query } });
        const props = {
          page: { route, path, query, scrollState },
          navigate,
          navigateReplace,
          component: Module.default,
        };
        if (app) {
          app.$set(props);
        } else {
          app = new App({
            target: document.body,
            props,
          });
        }
      } catch (err) {
        // loading error or something else
        console.log(err);
        throw err;
      }
    } else {
      // show 404
    }
  },
]);

history.subscribe(historian);
