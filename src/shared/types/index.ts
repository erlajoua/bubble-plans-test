export type { IGenre, IMovie }

interface IGenre {
  id: number
  name: string
}

interface IMovie {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  runtime: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
  genres?: IGenre[]
}
