<script>
  import { setContext } from 'svelte';
  export let page;
  export let navigate;
  export let navigateReplace;
  export let component;
  setContext('page', page);
  setContext('navigate', navigate);
  setContext('navigateReplace', navigateReplace);
</script>

<svelte:component this={component} />
