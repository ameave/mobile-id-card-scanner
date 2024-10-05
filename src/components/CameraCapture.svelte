<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  const dispatch = createEventDispatcher();

  let videoElement: HTMLVideoElement;
  let stream: MediaStream | null = null;
  let showModal = false;

  onMount(async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  });

  onDestroy(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  });

  function openCamera() {
    showModal = true;
    if (stream && videoElement) {
      videoElement.srcObject = stream;
      videoElement.play();
    }
  }

  function closeCamera() {
    showModal = false;
    if (videoElement) {
      videoElement.pause();
      videoElement.srcObject = null;
    }
  }

  function captureImage() {
    if (videoElement) {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      canvas.getContext('2d')?.drawImage(videoElement, 0, 0);
      canvas.toBlob(blob => {
        if (blob) {
          dispatch('imageCaptured', blob);
        }
      }, 'image/jpeg');
    }
    closeCamera();
  }
</script>

<div>
  <button on:click={openCamera}>Capture ID Image</button>
</div>

{#if showModal}
  <div class="modal">
    <div class="modal-content">
      <video bind:this={videoElement}></video>
      <div class="button-group">
        <button on:click={captureImage}>Capture</button>
        <button on:click={closeCamera}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
  }

  video {
    width: 100%;
    max-height: 70vh;
    object-fit: contain;
  }

  .button-group {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }
</style>