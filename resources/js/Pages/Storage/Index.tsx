import MainLayout from "@/Layouts/MainLayout";
import { StorageDetails, User } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Button, Chip, CircularProgress } from "@nextui-org/react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function Index({ auth, storageDetails }: { auth: { user: User }, storageDetails: StorageDetails }) {
    const resetStorage = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            showLoaderOnConfirm: true,
            preConfirm: async (login) => {
                const loadingToastId = toast.loading("Reseting...", {
                    position: 'top-right'
                })
                try {
                    await resetStoragePromise()
                    toast.success("Storage reset successfully", {
                        className: 'text-green-500',
                        position: 'top-right'
                    })
                } catch (error) {
                    toast.error("Failed reseting storage", {
                        className: 'text-red-500',
                        position: 'top-right'
                    })
                }
                toast.dismiss(loadingToastId)
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {

        });
    }
    const resetStoragePromise = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            router.post(route('storage.reset'), {}, {
                onFinish: () => {
                    resolve();
                },
                onError: () => {
                    reject()
                }
            })
        })
    }
    const removeAllTrash = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            showLoaderOnConfirm: true,
            preConfirm: async (login) => {
                const loadingToastId = toast.loading("Cleaning Up...", {
                    position: 'top-right'
                })
                try {
                    await removeAllTrashPromise()
                    toast.success("Trash cleaning up successfully", {
                        className: 'text-green-500',
                        position: 'top-right'
                    })
                } catch (error) {
                    toast.error("Failed cleaning up trash", {
                        className: 'text-red-500',
                        position: 'top-right'
                    })
                }
                toast.dismiss(loadingToastId)
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {

        });
    }
    const removeAllTrashPromise = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            router.post(route('storage.cleanTrash'), {}, {
                onFinish: () => {
                    resolve();
                },
                onError: () => {
                    reject()
                }
            })
        })
    }
    return <MainLayout auth={auth}>
        <Head title="Storage Data" />
        <h1 className="text-xl font-bold">Storage Detail</h1>
        <p className="text-slate-500 text-sm">Some details about your storage</p>
        <hr className="border-dashed mt-4" />
        <div className="flex flex-col lg:flex-row mt-10 gap-5 justify-center items-center">
            <div className="flex flex-col items-center gap-2">
                <CircularProgress
                    aria-label="Loading..."
                    size="lg"
                    value={(storageDetails.used_storage / storageDetails.total_storage) * 100}
                    color="warning"
                    showValueLabel={true}
                    classNames={{
                        svg: "w-36 h-36 drop-shadow-md",
                        indicator: "stroke-green-500",
                        track: "stroke-green-500/10",
                        value: "text-3xl font-semibold text-slate-600",
                    }}
                />
                <Chip
                    classNames={{
                        base: "border-1 border-slate-600/30",
                        content: "text-slate-700/90 text-small font-semibold",
                    }}
                    variant="bordered"
                >
                    Storage Used
                </Chip>
            </div>
            <div className="">
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <p>Total Storage</p>
                        <p>Storage Used</p>
                        <p>Remaining Storage</p>
                        <p>Used Storage in trash</p>
                    </div>
                    <div>
                        <p>: {storageDetails.total_storage} GB</p>
                        <p>: {storageDetails.usage_in_drive} GB</p>
                        <p>: {storageDetails.remaining_storage} GB</p>
                        <p>: {storageDetails.usage_in_drive_trash} GB</p>
                    </div>
                </div>
                <div className="flex gap-3 mt-5">
                    <Button onPress={removeAllTrash} className="bg-amber-500 hover:bg-amber-800 text-white font-semibold">Remove All Trash</Button>
                    <Button onPress={resetStorage} className="bg-red-500 hover:bg-red-700 text-white font-bold">Reset Storage</Button>
                </div>
            </div>
        </div>
    </MainLayout>
}
