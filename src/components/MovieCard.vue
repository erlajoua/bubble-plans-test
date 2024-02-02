<template>
  <div class="movie-item" @click="navigateToMovieDetails">
    <img :src="`https://image.tmdb.org/t/p/w500/${posterPath}`" :alt="title" />
    <span class="title-movie">{{ title }}</span>
    <span>{{ releaseDate }}</span>
    <i
      @click="toggleWatched"
      :class="['fas', !isWatched ? 'fa-eye' : 'fa-minus-circle', 'watched-icon']"
    ></i>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MovieCard',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    posterPath: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    releaseDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isWatched: false
    }
  },
  mounted() {
    this.isWatched = localStorage.getItem(`watched-${this.id}`) === 'true'
  },
  methods: {
    toggleWatched(e: MouseEvent) {
      e.stopPropagation();
      this.isWatched = !this.isWatched
      localStorage.setItem(`watched-${this.id}`, this.isWatched.toString())
    },
    navigateToMovieDetails(e: MouseEvent) {
      e.stopPropagation();
      this.$router.push({ name: 'movie', params: { id: this.id } })
    }
  }
}
</script>

<style scoped>
.movie-item {
  max-width: 186px;
  padding: 8px 16px;
  text-align: center;
  background-color: var(--primary);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  cursor: pointer;
  transform: scale(97%);
  transition: transform 0.3s ease-in-out;
}

.movie-item:hover {
  transform: scale(100%);
  outline: 3px var(--secondary) solid;
}
.title-movie {
  font-weight: 700;
  font-size: 18px;
  margin-top: 8px;
}

img {
  width: 160px;
  object-fit: contain;
  height: auto;
  border-radius: 8px;
}

.watched-icon {
  color: var(--secondary);
  position: absolute; 
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
