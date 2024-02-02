<script lang="ts">
import axios from 'axios'
import MovieCard from '../components/MovieCard.vue'
import type { IMovie } from '@/shared/types'
import { fetchMoviesByIds } from '../services/tmdbApi'

export default {
  name: 'WatchedMovies',
  components: {
    MovieCard
  },
  data() {
    return {
      watched: [] as IMovie[],
      isLoading: false as boolean
    }
  },
  mounted() {
    this.loadWatched()
  },
  methods: {
    async loadWatched() {
      this.isLoading = true
      const movieIds: string[] = []

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || ''
        if (key.startsWith('watched-')) {
          const movieId = key.split('-')[1]
          const value = localStorage.getItem(key)
          if (value === 'true') {
            movieIds.push(movieId)
          }
        }
      }

      try {
        this.watched = await fetchMoviesByIds(movieIds)
      } catch (error) {
        console.error('Error', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<template>
  <main>
    <h1>Watched movies</h1>
    <div v-if="isLoading"><span>Loading...</span></div>
    <span v-else-if="!isLoading && watched.length === 0">No movie in watched list</span>
    <div v-else class="watched-container">
      <MovieCard
        v-for="movie in watched"
        :key="movie.id"
        :id="movie.id"
        :posterPath="movie.poster_path || ''"
        :title="movie.title"
        :releaseDate="movie.release_date"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 48px 48px 0px 48px;
}

h1 {
  color: var(--secondary);
  margin-bottom: 16px;
}
.watched-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .watched-container {
    justify-content: center;
  }
}
</style>
