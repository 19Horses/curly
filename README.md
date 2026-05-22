# Handover document

## For project managers

#### Frontend

The website can be seen at [https://curlymedialtd.com/](https://curlymedialtd.com/).

#### Backend

The backend Content Management System (CMS) is a Sanity studio hosted at [https://curly.sanity.studio/](https://curly.sanity.studio/).

To upload `Global` content like contact information you can go to the `Global` panel section at the above url. Example below:

---

## <img width="1728" height="1117" alt="Screenshot 2026-05-22 at 14 14 25" src="https://github.com/user-attachments/assets/c2337453-bc76-47ec-a9e9-52ac8ab27174" />

To upload case studies and jobs you can go to the `Content` panel section at the above url. Example below:

---

## <img width="1728" height="1117" alt="Screenshot 2026-05-22 at 14 14 54" src="https://github.com/user-attachments/assets/e8817e78-20f5-4ef7-bc06-244734cda307" />

#### Videos

The videos are uploaded via Sanity but are stored on [Mux](https://dashboard.mux.com/organizations/kr7dvi/environments/6j59gl/video/assets). The free tier of Mux only allows 10 videos. If you have trouble uploading videos through Sanity this could be the issue. To have more than 10 videos you can upgrade to a paid version of Mux.

You can manage all of the videos in Sanity [here](https://core-b4y2wuwly.sanity.build/@oJckvGHYA/studio/mqzqomz1b2co7uvbgx794mfm/default/mux).

## For developers

### High level architecture

#### Frontend

The frontend is served from the [frontend](./frontend/) directory and is built with React + Vite and uses [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) for the 3D elements.

It is deployed on Github Pages. The deployments are triggered on merges into the `main` branch by an automated [Github Actions job](./.github/workflows/frontend.yml).

The deployment is configured in this Github repo at `Settings -> Pages`.

#### Backend

The backend is managed and deployed with [Sanity CMS](https://www.sanity.io/docs). The studio is hosted at [https://curly.sanity.studio/](https://curly.sanity.studio/).

The images are served via the Sanity CDN and mostly configured in code with [this file](./frontend/src/sanityImageUrl.ts)

The videos are hosted on [Mux](https://www.mux.com/) but are uploaded via the Sanity CMS studio dashboard using the [Mux plugin](https://www.sanity.io/plugins/sanity-plugin-mux-input). This allows for much better video hosting and streaming. The only catch is that Mux's free tier only allows 10 video uploads. If there are any issues with uploading videos via Sanity this might be the cause.

The deployments are triggered on merges into the `main` branch by an automated [Github Actions job](./.github/workflows/backend.yml). This requires a Deploy Token which I created through Sanity [here](https://www.sanity.io/organizations/oJckvGHYA/project/7wckvdr0/api).

If the frontend domain ever changes you will need to tell Sanity to allow traffic from the new domain. This can be configured through Sanity [here](https://www.sanity.io/organizations/oJckvGHYA/project/7wckvdr0/api/cors-origins).

### Instructions for setup

1. Install dependencies for `frontend` and `backend`

```
yarn
```

2. To run both the `frontend` and `backend` locally

```
yarn dev
```

3. To run just the `frontend` locally

```
cd frontend && yarn start
```

4. To run just the `backend` locally

```
cd backend && yarn dev
```

5. To manually deploy the backend

```
cd backend && yarn deploy
```
