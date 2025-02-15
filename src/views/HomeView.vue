<script setup lang="ts">
import InputField from '@/components/InputField.vue';
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
    <InputField />

    <!-- Recipe list -->
    <div class="flex flex-col items-center p-4 ">
      <div class="container w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        <h2 class="">Recipe List</h2>
      </div>
    </div>
  </div>


</template>