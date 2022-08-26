<template>
  <h1>CopyBoard</h1>
  <div class="btn-group" role="group" aria-label="Basic outlined example">
    <router-link to="/" class="btn btn-outline-primary">主页</router-link>
    <router-link to="/add" class="btn btn-outline-primary">添加</router-link>
    <router-link to="/manage" class="btn btn-outline-primary">管理</router-link>
  </div>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
