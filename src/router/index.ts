import { createRouter, createWebHistory } from 'vue-router'
import WatchedMoviesView from '../views/WatchedMoviesView.vue'
import BestMoviesView from '../views/BestMoviesView.vue'
import CardView from '../views/CardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/watchedmovies',
      name: 'Watched Movies',
      component: WatchedMoviesView
    },
    {
      path: '/bestmovies',
      name: 'Best Movies',
      component: BestMoviesView
    },
    {
      path: '/movie/:id',
      name: 'movie',
      component: CardView
    },
    {
      path: '/',
      name: 'home',
      redirect: { path: "/bestmovies" },
      children: [
        {
          path: "/bestmovies",
          name: "Best Movies",
          component: BestMoviesView
        },
      ],
    }
  ]
})

export default router
