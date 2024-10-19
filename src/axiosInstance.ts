import axios, { AxiosRequestConfig } from "axios";

const baseURL = "https://kevii-gym-booking-api.vercel.app";
const token = localStorage.getItem("kevii-gym-token");

const headers: AxiosRequestConfig["headers"] = {
  "Content-Type": "application/json",
};

if (token) {
  headers.Authorization = `Bearer ${token}`;
}

const instance = axios.create({
  baseURL,
  headers,
});

// http://localhost:8000
// https://kevii-gym-booking-api.vercel.app

export default instance;
