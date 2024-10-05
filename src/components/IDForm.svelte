<script lang="ts">
  import type { IDData } from '../types';

  export let idData: IDData;
</script>

<form>
  <div>
    <label for="firstName">First Name:</label>
    <input type="text" id="firstName" bind:value={idData.firstName} />
  </div>
  <div>
    <label for="lastName">Last Name:</label>
    <input type="text" id="lastName" bind:value={idData.lastName} />
  </div>
  <div>
    <label for="idNumber">ID Number:</label>
    <input type="text" id="idNumber" bind:value={idData.idNumber} />
  </div>
  <div>
    <label for="birthDate">Birth Date:</label>
    <input type="text" id="birthDate" bind:value={idData.birthDate} />
  </div>
  <div>
    <label for="sex">Sex:</label>
    <input type="text" id="sex" bind:value={idData.sex} />
  </div>
  <div>
    <label for="addressStreet">Address Street:</label>
    <input type="text" id="addressStreet" bind:value={idData.addressStreet} />
  </div>
  <div>
    <label for="addressNumber">Address Number:</label>
    <input type="text" id="addressNumber" bind:value={idData.addressNumber} />
  </div>
  <div>
    <label for="postalCode">Postal Code:</label>
    <input type="text" id="postalCode" bind:value={idData.postalCode} />
  </div>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  label {
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>