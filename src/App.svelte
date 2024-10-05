<script lang="ts">
  import { createWorker } from 'tesseract.js';
  import Camera from './lib/Camera.svelte';

  let showCamera = false;
  let capturedImage: string | null = null;
  let ocrResult: string = '';
  let isProcessing = false;
  let errorMessage = '';

  const formFields = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'idNumber', label: 'Card ID Number' },
    { key: 'birthDate', label: 'Birth Date' },
    { key: 'sex', label: 'Sex' },
    { key: 'addressStreet', label: 'Address Street' },
    { key: 'addressNumber', label: 'Address Number' },
    { key: 'postalCode', label: 'Postal Code' },
  ];

  let formData: Record<string, string> = formFields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {});

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        capturedImage = e.target?.result as string;
        processImage(capturedImage);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  function handleCapture(event: CustomEvent) {
    capturedImage = event.detail.imageDataUrl;
    showCamera = false;
    processImage(capturedImage);
  }

  function handleCameraError(event: CustomEvent) {
    errorMessage = "Camera access failed. Please use the file upload option.";
    showCamera = false;
  }

  async function processImage(imageData: string) {
    isProcessing = true;
    errorMessage = '';
    try {
      const worker = await createWorker('eng');
      const result = await worker.recognize(imageData);
      ocrResult = result.data.text;
      await worker.terminate();
      extractInformation(ocrResult);
    } catch (error) {
      console.error("OCR processing error:", error);
      errorMessage = "Failed to process the image. Please try again.";
    } finally {
      isProcessing = false;
    }
  }

  function extractInformation(text: string) {
    // Implement logic to extract information from OCR result
    // This is a simplified example and may need to be adjusted based on the actual ID card format
    const lines = text.split('\n');
    formData.firstName = lines.find(line => line.includes('First Name'))?.split(':')[1]?.trim() || '';
    formData.lastName = lines.find(line => line.includes('Last Name'))?.split(':')[1]?.trim() || '';
    formData.idNumber = lines.find(line => line.includes('ID Number'))?.split(':')[1]?.trim() || '';
    formData.birthDate = lines.find(line => line.includes('Birth Date'))?.split(':')[1]?.trim() || '';
    formData.sex = lines.find(line => line.includes('Sex'))?.split(':')[1]?.trim() || '';
    formData.addressStreet = lines.find(line => line.includes('Address'))?.split(':')[1]?.trim() || '';
    formData.addressNumber = lines.find(line => line.includes('Address Number'))?.split(':')[1]?.trim() || '';
    formData.postalCode = lines.find(line => line.includes('Postal Code'))?.split(':')[1]?.trim() || '';
  }
</script>

<main>
  <h1>ID Card Scanner</h1>
  
  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}

  <div class="actions">
    <button on:click={() => showCamera = true}>Capture Image</button>
    <input type="file" accept="image/*" on:change={handleFileSelect} />
  </div>

  {#if showCamera}
    <Camera on:capture={handleCapture} on:close={() => showCamera = false} on:cameraError={handleCameraError} />
  {/if}

  {#if capturedImage}
    <img src={capturedImage} alt="Captured ID" class="captured-image" />
  {/if}

  {#if isProcessing}
    <p>Processing image...</p>
  {/if}

  <form>
    {#each formFields as field}
      <div class="form-field">
        <label for={field.key}>{field.label}</label>
        <input type="text" id={field.key} bind:value={formData[field.key]} />
      </div>
    {/each}
  </form>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .captured-image {
    max-width: 100%;
    margin-bottom: 1rem;
  }

  .form-field {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .error-message {
    color: red;
    margin-bottom: 1rem;
  }

  button {
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