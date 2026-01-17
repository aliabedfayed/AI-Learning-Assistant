import axiosInstance from '../utilities/axiosInstance';
import { API_PATHS } from '../utilities/apiPaths';
import { LoginData } from '@/interfaces/auth/login';
import { ProfileData } from '@/interfaces/auth/profile';
import { RegisterResponse } from '@/interfaces/auth/register';
import { UpdateProfileData } from '@/interfaces/auth/updateProfile';
import { ChangePassword } from '@/interfaces/auth/changePassword';

export const login = async ({ email, password }: { email: string, password: string }): Promise<LoginData> => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
    });
    return response.data;
};

export const register = async ({ username, email, password }: { username: string, email: string, password: string }): Promise<RegisterResponse> => {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        username,
        email,
        password,
    });
    return response.data;
};

export const getProfile = async (): Promise<ProfileData> => {
    const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
    return response.data;
};

export const updateProfile = async (userData: { username: string, email: string }): Promise<UpdateProfileData> => {
    const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, userData);
    return response.data;
};

export const changePassword = async (passwords: { currentPassword: string, newPassword: string }): Promise<ChangePassword> => {
    const response = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, passwords);
    return response.data;
};