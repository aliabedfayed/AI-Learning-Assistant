import axiosInstance from '../utilities/axiosInstance';
import { API_PATHS } from '../utilities/apiPaths';
import { Dashboard } from '@/interfaces/dashboard';

export const getDashboardData = async (): Promise<Dashboard> => {
    const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD);
    return response.data;
};