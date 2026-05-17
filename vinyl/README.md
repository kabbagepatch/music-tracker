# Vinyl Tracker

PWA built using Vue, you can use this to keep track of your vinyl catalog and listening history, to see visualized user trends and stats. Uses the Discogs API to get the Vinyl data and build the catalog.

## Workflow and Implementation

### Run Locally

```
yarn install

yarn dev
```

### User Workflow

The user can add vinyls to their catalog using the search function. I use the Discogs API to get the Vinyl results to allow the users to build their catalog. The application displays the vinyl tracks, disc colors and barcodes to confirm the correct vinyl is being selected.

Once the user has vinyls in their catalog, they can log vinyl activity by selecting any of their vinyls and "playing" them. The app then keeps track of the vinyl activity and generates monthly and yearly stats from this data.

### Screenshots



### Technical Implementation

The frontend is written using Vue.js. The project was generated using the [Vite PWA plugin](https://vite-pwa-org.netlify.app/guide/). It uses vue-router for page routing and firebase for user authentication.

The backend is implemented in the [tracker-services](https://github.com/kabbagepatch/tracker-services/blob/main/vinyls.js) repo.
