<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      dispatch('imageSelected', target.files[0]);
    }
  }
</script>

<div>
  <input type="file" accept="image/*" on:change={handleFileInput} id="fileInput" style="display: none;" />
  <button on:click={() => document.getElementById('fileInput')?.click()}>
    Select ID Image
  </button>
</div>