<template>
  <router-view/>
</template>

<style>
body {
  background-color: #fcfcfc;
}

button {
  padding: 8px 10px;
  background: none;
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
  border-width: 1px;
}

.click_icon {
  cursor: pointer;
}

@keyframes rotate360 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
