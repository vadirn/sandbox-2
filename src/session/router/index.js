import { manifest } from '@tw/manifest';
import { observable } from 'observable';

const history = observable([
  {
    href: window.location.href,
    type: 'push',
    state: {},
  },
]);

window.addEventListener('popstate', () => {
  const href = window.location.href;

  history.set({ url, type: 'pop' });
});

function historyPop() {
  const url = new URL(window.location.href);
}

function historyPush(urlString) {
  const url = new URL(urlString, window.location.origin);
  window.history.pushState(null, null, url);
  history.set({
    url,
    type: 'push',
  });
}

function historyReplace(urlString) {
  const url = new URL(urlString, window.location.origin);
  window.history.replaceState(null, null, url);
  history.set({
    url,
    type: 'replace',
  });
}
