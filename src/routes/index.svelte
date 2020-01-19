<script context="module">
  export async function preload() {
    console.log('run preload');
  }
</script>

<script>
  import { getContext } from 'svelte';
  const navigate = getContext('navigate');
</script>

Hello, this is index
<a href="/arg1" on:click={navigate}>/arg1</a>
