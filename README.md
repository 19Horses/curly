# Curly Media Handover

## Quick Links

- Website: [curlymedialtd.com](https://curlymedialtd.com/)
- Sanity Studio: [curly.sanity.studio](https://curly.sanity.studio/)
- Mux assets: [dashboard.mux.com](https://dashboard.mux.com/organizations/kr7dvi/environments/6j59gl/video/assets)
- Frontend app: [`frontend`](./frontend/)
- Backend studio: [`backend`](./backend/)

## For Project Managers

### Website

The live website can be viewed at [curlymedialtd.com](https://curlymedialtd.com/).

### Content Management

The backend Content Management System (CMS) is a Sanity studio hosted at [curly.sanity.studio](https://curly.sanity.studio/).

Use the `Global` panel in Sanity to update site-wide content such as contact information.

<img width="1728" height="1117" alt="Sanity Global panel" src="https://github.com/user-attachments/assets/c2337453-bc76-47ec-a9e9-52ac8ab27174" />

Use the `Content` panel in Sanity to update case studies and jobs.

<img width="1728" height="1117" alt="Sanity Content panel" src="https://github.com/user-attachments/assets/e8817e78-20f5-4ef7-bc06-244734cda307" />

### Videos

Videos are uploaded through Sanity and stored on [Mux](https://dashboard.mux.com/organizations/kr7dvi/environments/6j59gl/video/assets). Mux's free tier only allows 10 videos, so if video uploads fail in Sanity, that limit may be the cause.

Videos can be managed in Sanity from the [Mux plugin dashboard](https://core-b4y2wuwly.sanity.build/@oJckvGHYA/studio/mqzqomz1b2co7uvbgx794mfm/default/mux).

## For Developers

### Architecture

#### Frontend

The frontend lives in [`frontend`](./frontend/). It is built with React + Vite and uses [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) for the 3D elements.

The frontend is deployed on GitHub Pages. Deployments are triggered by merges into `main` through the [frontend GitHub Actions workflow](./.github/workflows/frontend.yml).

GitHub Pages configuration lives in this repository under `Settings -> Pages`.

#### Backend

The backend is managed with [Sanity CMS](https://www.sanity.io/docs), and the studio is hosted at [curly.sanity.studio](https://curly.sanity.studio/).

Images are served through the Sanity CDN. Image URL configuration mostly lives in [`frontend/src/sanityImageUrl.ts`](./frontend/src/sanityImageUrl.ts).

Videos are hosted on [Mux](https://www.mux.com/) and uploaded through Sanity using the [Mux plugin](https://www.sanity.io/plugins/sanity-plugin-mux-input). This gives better video hosting and streaming, but Mux's free tier only allows 10 uploads.

Backend deployments are triggered by merges into `main` through the [backend GitHub Actions workflow](./.github/workflows/backend.yml). Deployment requires a Sanity deploy token, which is managed in the [Sanity API settings](https://www.sanity.io/organizations/oJckvGHYA/project/7wckvdr0/api).

If the frontend domain changes, add the new domain to Sanity's allowed CORS origins in the [Sanity CORS settings](https://www.sanity.io/organizations/oJckvGHYA/project/7wckvdr0/api/cors-origins).

### Local Setup

Install dependencies for both `frontend` and `backend`:

```bash
yarn
```

Run both the frontend and backend locally:

```bash
yarn dev
```

Run only the frontend:

```bash
cd frontend && yarn start
```

Run only the backend:

```bash
cd backend && yarn dev
```

Deploy the backend manually:

```bash
cd backend && yarn deploy
```
