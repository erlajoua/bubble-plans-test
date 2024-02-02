<script lang="ts">
export default {
  name: 'App'
}
</script>

<template>
  <nav>
    <RouterLink to="/bestmovies">Best Movies</RouterLink>
    <RouterLink to="/watchedmovies">Watched movies</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  justify-content: center;
  gap: 48px;
  align-items: center;
  padding: 1rem;
  background-color: var(--primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav a {
  color: var(--off-white);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

nav a:hover,
.router-link-exact-active {
  color: var(--secondary);
}

.router-link-exact-active {
  border-bottom: 2px solid var(--secondary);
}
</style>
