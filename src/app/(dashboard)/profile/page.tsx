"use client"
import { changePassword, getProfile } from '@/services/authService';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useFormik } from "formik";
import * as Yup from "yup";
import Spinner from '@/components/common/Spinner';
import PageHeader from '@/components/common/PageHeader';
import { Lock, Mail, User } from 'lucide-react';
import Button from '@/components/common/Button';

const changePasswordSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords do not match")
        .required("Confirm password is required"),
})

export default function Profile() {
    const { data, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await getProfile()
            return res.data
        }
    })


    const changePasswordMutation = useMutation({
        mutationFn: (values: {
            currentPassword: string
            newPassword: string
        }) => changePassword(values),
        onSuccess: () => {
            toast.success("Password changed successfully!")
            formik.resetForm()
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to change password.")
        }
    })

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        },
        validationSchema: changePasswordSchema,
        onSubmit: (values) => {
            changePasswordMutation.mutate({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            })
        }
    })

    if (isLoading) {
        return <Spinner />
    }

    return (
        <>
            <div>
                <PageHeader title="Profile Settings" />

                <div className="space-y-8">
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                            User Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900">
                                        {data?.username}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900">
                                        {data?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                            Change Password
                        </h3>
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <input
                                        name='currentPassword'
                                        type="password"
                                        value={formik.values.currentPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
                                    />
                                </div>
                                {formik.touched.currentPassword && formik.errors.currentPassword && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {formik.errors.currentPassword}
                                    </p>
                                )}

                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <input
                                        name='newPassword'
                                        type="password"
                                        value={formik.values.newPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
                                    />
                                </div>
                                {formik.touched.newPassword && formik.errors.newPassword && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {formik.errors.newPassword}
                                    </p>
                                )}

                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <input
                                        name='confirmNewPassword'
                                        type="password"
                                        value={formik.values.confirmNewPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
                                    />
                                </div>
                                {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {formik.errors.confirmNewPassword}
                                    </p>
                                )}

                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={changePasswordMutation.isPending || !formik.isValid}>
                                    {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
