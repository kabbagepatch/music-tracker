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

<img width="300" height="548" alt="image" src="https://github.com/user-attachments/assets/0d874a4e-4cda-4f43-807a-ce20972a2ccb" />
<img width="300" height="548" alt="image" src="https://github.com/user-attachments/assets/1d3679e0-d41f-48a5-b02d-90493a713703" />

<img width="300" height="548" alt="image" src="https://github.com/user-attachments/assets/c433682f-e4f8-421b-9562-68b687a39b8a" />
<img width="300" height="548" alt="image" src="https://github.com/user-attachments/assets/e0233be5-bf4a-4135-a747-a07581a8f62f" />

### Technical Implementation

The frontend is written using Vue.js. The project was generated using the [Vite PWA plugin](https://vite-pwa-org.netlify.app/guide/). It uses vue-router for page routing and firebase for user authentication.

The backend is implemented in the [tracker-services](https://github.com/kabbagepatch/tracker-services/blob/main/vinyls.js) repo.
