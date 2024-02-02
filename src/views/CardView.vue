<script lang="ts">
import axios from 'axios'
import MovieCard from '../components/MovieCard.vue'
import type { IMovie, IGenre } from '@/shared/types'

export default {
  name: 'CardView',
  components: {
    MovieCard
  },
  data() {
    return {
      movie: {} as IMovie,
      isLoading: true
    }
  },
  computed: {
    genres() {
      if (this.movie && this.movie.genres) {
        return this.movie.genres.map((genre: IGenre) => genre.name).join(', ')
      }
      return ''
    }
  },
  async mounted() {
    this.isLoading = true
    const movieId = this.$route.params.id
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
          }
        }
      )
      this.movie = response.data
    } catch (error) {
      console.log(error)
    } finally {
      this.isLoading = false
    }
  }
}
</script>

<template>
  <div class="movie-details" v-if="!isLoading">
    <MovieCard
      :id="movie.id"
      :posterPath="movie.poster_path || ''"
      :title="movie.title"
      :releaseDate="movie.release_date"
    />
    <div class="additional-details">
      <h2>Overview</h2>
      <p>{{ movie.overview }}</p>
      <p><strong>Genres:</strong> {{ genres }}</p>
      <p><strong>Runtime:</strong> {{ movie.runtime }} minutes</p>
      <p><strong>Rating:</strong> {{ movie.vote_average }} ({{ movie.vote_count }} votes)</p>
      <p><strong>Release Date:</strong> {{ movie.release_date }}</p>
    </div>
  </div>
  <div v-else>
    <span>Loading...</span>
  </div>
</template>

<style scoped>
.movie-details {
  padding: 48px 48px 0px 48px;
  display: flex;
  flex-direction: column;
}

.additional-details {
  margin-top: 20px;
  width: 30%;
}

.additional-details h2 {
  margin-bottom: 10px;
}

.additional-details p {
  margin: 5px 0;
}

@media (max-width: 768px) {
  .movie-details {
    padding-left: 24px;
  }
  .additional-details {
    width: 100%;
  }
}
</style>
