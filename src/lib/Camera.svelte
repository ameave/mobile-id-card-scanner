<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let videoElement: HTMLVideoElement;
  let stream: MediaStream | null = null;
  let errorMessage = '';

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoElement) {
        videoElement.srcObject = stream;
      }
      errorMessage = '';
    } catch (error) {
      console.error("Error accessing camera:", error);
      errorMessage = "Camera access failed. Please ensure you've granted permission or try using the file upload option.";
      dispatch('cameraError', { error });
    }
  }

  function captureImage() {
    if (videoElement) {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      canvas.getContext('2d')?.drawImage(videoElement, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      dispatch('capture', { imageDataUrl });
    }
  }

  function closeCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    dispatch('close');
  }

  $: if (videoElement && !stream) {
    startCamera();
  }
</script>

<div class="camera-container">
  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
    <button on:click={closeCamera}>Close</button>
  {:else}
    <video bind:this={videoElement} autoplay playsinline></video>
    <div class="camera-controls">
      <button on:click={captureImage}>Capture</button>
      <button on:click={closeCamera}>Close</button>
    </div>
  {/if}
</div>

<style>
  .camera-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  video {
    max-width: 100%;
    max-height: 80vh;
  }

  .camera-controls {
    margin-top: 1rem;
  }

  .error-message {
    color: white;
    text-align: center;
    margin-bottom: 1rem;
  }

  button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }
</style>