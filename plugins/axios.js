import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {

  
  const config = nuxtApp.$config
  // Créer une instance d'Axios avec une configuration de base
  const api = axios.create({
    baseURL: config.public.API_URL,
    timeout: 10000,
  });

  // Intercepteurs de requêtes
  api.interceptors.request.use((config) => {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImN0eSI6IkpXVCJ9.eyJpYXQiOjE3MjY0NzYzMTUsImV4cCI6MTgyNjQ3NjMxNCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6InRlc3QzQGdtYWlsLmNvbSIsIm5hbWUiOiJ0ZXN0In0.GvClTnXOWhhhUeI9nz7fKTmEgpsQ8elk5IZeyACggnOWQ95_rcFOZCDcOMHq-TucAW_v1crgXQRFpqsbbVMpdB3-Ih8iJAfQuSACfxJZ0A6nb_y4nor0Td5ngrmIdl8o8duNLScXHpXftb2SnAu1n9EeG-fqCVP6EYHEChfaRVIKDSl15zXIN9zMqKTZx6rhI4lcX9kICwTYbkobhqOFtY61s58Weidh9bcdr3lOz7fstfgGQL2EXBmdF50In5fnKhxSzFpruaIsHg0urrbGykdrxqRP-kqfjb03oZWHXOWTGbu9SAkHCplmsohpyH1v7d7G92_E_NaG7iQjhMRXLw";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Intercepteurs de réponses
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        nuxtApp.$auth?.logout();
      }
      return Promise.reject(error);
    }
  );

  nuxtApp.provide("api", api);
});
