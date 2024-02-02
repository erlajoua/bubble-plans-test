<script lang="ts">
import MovieCard from '../components/MovieCard.vue'
import { fetchTopRatedMovies, fetchMovieGenres } from '../services/tmdbApi'
import type {IMovie, IGenre} from '../shared/types/index'

export default {
  name: 'BestMovies',
  data() {
    return {
      allMovies: [] as IMovie[],
      filteredMovies: {} as Record<string, IMovie[]>,
      decades: [] as string[],
      page: 1 as number,
      totalPages: null as number | null,
      isLoading: true as boolean,
      searchQuery: '' as string,
      selectedGenre: '' as any,
      genreMappings: [] as IGenre[],
      uniqueGenreIds: new Set()
    }
  },
  components: {
    MovieCard
  },
  computed: {
    filteredBySearchQuery() {
      let filtered = this.applyTitleFilter()

      if (this.selectedGenre) {
        filtered = this.applyGenreFilter(filtered)
      }

      return filtered
    },
    hasMoviesInDecade() {
      return (decade: string) => {
        return this.filteredBySearchQuery[decade] && this.filteredBySearchQuery[decade].length > 0
      }
    }
  },
  async mounted() {
    {
      try {
        this.genreMappings = await fetchMovieGenres()
        this.loadMovies()
      } catch (error) {
        console.error(error)
      }
    }
  },
  methods: {
    async loadMovies() {
      const TARGET_TOTAL_MOVIES = 2000
      const MOVIES_PER_LOAD = 20
      const MAX_PAGES_TO_LOAD = Math.ceil(TARGET_TOTAL_MOVIES / MOVIES_PER_LOAD)
      const PAGES_PER_BLOCK = 10

      while (this.allMovies.length < TARGET_TOTAL_MOVIES && this.page <= MAX_PAGES_TO_LOAD) {
        try {
          const newMovies = await fetchTopRatedMovies(this.page, PAGES_PER_BLOCK)
          this.allMovies = [...new Set([...this.allMovies, ...newMovies])]

          this.page += PAGES_PER_BLOCK

          this.sortMoviesByDecade()

          this.allMovies.forEach((movie: IMovie) => {
            movie.genre_ids.forEach((genreId: number) => this.uniqueGenreIds.add(genreId))
          })

          this.updateGenreMappings()
          this.isLoading = false
        } catch (error) {
          console.error('Error while fetching movies')
          break
        }
      }
    },
    finalizeDecadesSorting() {
      Object.keys(this.filteredMovies).forEach((decade) => {
        this.filteredMovies[decade].sort((a: IMovie, b: IMovie) => {
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        })

        if (!this.decades.includes(decade)) {
          this.decades.push(decade)
        }
      })

      this.decades.sort((a: string, b: string) => parseInt(b) - parseInt(a))
    },

    sortMoviesByDecade() {
      this.filteredMovies = {}
      this.decades = []
      const uniqueMovieIds = new Set()

      this.allMovies.forEach((movie: IMovie) => {
        if (!movie.release_date || uniqueMovieIds.has(movie.id)) return

        const year = parseInt(movie.release_date.substring(0, 4))
        const decade = Math.floor(year / 10) * 10
        if (!this.filteredMovies[decade]) {
          this.filteredMovies[decade] = []
        }

        uniqueMovieIds.add(movie.id)
        this.filteredMovies[decade].push(movie)
      })

      this.finalizeDecadesSorting()
    },
    applyTitleFilter() {
      const searchQueryLowerCase = this.searchQuery.toLowerCase()
      const filtered = {} as Record<string, IMovie[]>

      Object.keys(this.filteredMovies).forEach((decade) => {
        filtered[decade] = this.filteredMovies[decade].filter((movie: IMovie) =>
          movie.title.toLowerCase().includes(searchQueryLowerCase)
        )
      })

      return filtered
    },
    applyGenreFilter(filteredMovies: Record<string, IMovie[]>) {
      const filtered = {} as Record<string, IMovie[]>

      Object.keys(filteredMovies).forEach((decade) => {
        filtered[decade] = filteredMovies[decade].filter((movie: IMovie) => {
          return movie.genre_ids.includes(parseInt(this.selectedGenre))
        })
      })

      return filtered
    },
    updateGenreMappings() {
      this.genreMappings = this.genreMappings.filter((genre: IGenre) =>
        this.uniqueGenreIds.has(genre.id)
      )
    }
  }
}
</script>

<template>
  <div id="best-movies">
    <h1>Best movies</h1>
    <div class="filters">
      <input type="text" v-model="searchQuery" placeholder="Search movies..." class="search-box" />
      <select v-model="selectedGenre" class="custom-select">
        <option value="">All Genres</option>
        <option v-for="(genre, id) in genreMappings" :key="id" :value="genre.id">
          {{ genre.name }}
        </option>
      </select>
    </div>
    <div v-if="isLoading"><span>Loading...</span></div>
    <div v-for="decade in decades" :key="`decade-${decade}`" class="decade-carousel">
      <div v-if="hasMoviesInDecade(decade)">
        <span class="decade-title">{{ decade }}s</span>
        <div class="carousel">
          <MovieCard
            v-for="movie in filteredBySearchQuery[decade]"
            :key="movie.id"
            :id="movie.id"
            :posterPath="movie.poster_path || ''"
            :title="movie.title"
            :releaseDate="movie.release_date"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-select {
  padding: 12px 16px;
  width: 160px;
  border-radius: 8px;
  border: 2px solid var(--secondary);
  background-color: white;
  font-size: 16px;
  color: #495057;
  appearance: none;
}

.custom-select:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

#best-movies {
  color: var(--secondary);
  padding: 48px 0px 0px 48px;
}

h1 {
  color: var(--secondary);
  margin: 0 16px 0 0;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.decade-title {
  font-size: 24px;
  font-weight: 700;
}

.decade-carousel {
  margin-bottom: 20px;
}

.carousel {
  display: flex;
  overflow-x: auto;
  padding: 10px 0;
  gap: 48px;
}

.carousel::-webkit-scrollbar {
  width: 1px;
  height: 6px;
}

.carousel::-webkit-scrollbar-thumb {
  border-radius: 20px;
  border: 3px solid var(--secondary);
}

.search-box {
  width: 240px;
  padding: 12px 16px;
  font-size: 16px;
  color: var(--primary);
  background-color: var(--off-white);
  border: 2px solid var(--secondary);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-box:focus {
  border-color: var(--primary);
  outline: none;
}

@media (max-width : 768px) {

  #best-movies {
    padding-left: 24px; 
  }
  .search-box {
    width: 140px;
  }
}
</style>
