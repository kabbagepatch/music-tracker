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

<img width="300" height="553" alt="Vinyl Activity" src="https://github.com/user-attachments/assets/562ecc49-f7f4-4db0-b0ba-355c7da34b8d" />
<img width="300" height="553" alt="Vinyl Catalog" src="https://github.com/user-attachments/assets/a696c6dc-bb82-4d5a-b4ba-b40cfcadff69" />
<br>
<img width="300" height="553" alt="Vinyl Page" src="https://github.com/user-attachments/assets/053f9df5-0313-418a-9be2-c761054c5ba8" />
<img width="300" height="553" alt="Vinyl Search" src="https://github.com/user-attachments/assets/72795984-fe36-41a9-ab9c-e2ff2dec7659" />

### Technical Implementation

The frontend is written using Vue.js. The project was generated using the [Vite PWA plugin](https://vite-pwa-org.netlify.app/guide/). It uses vue-router for page routing and firebase for user authentication.

The backend is implemented in the [tracker-services](https://github.com/kabbagepatch/tracker-services/blob/main/vinyls.js) repo.
