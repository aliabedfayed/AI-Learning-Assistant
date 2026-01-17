"use client"
import axios, { InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "./apiPaths";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: BASE_URL
})

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = Cookies.get("userToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove("userToken", { path: "/" })
            Cookies.remove("user", { path: "/" })

            if (typeof window !== "undefined") {
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

export default axiosInstance