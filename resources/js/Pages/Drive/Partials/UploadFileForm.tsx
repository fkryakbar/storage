import { router, useForm } from "@inertiajs/react";
import { Modal, ModalContent, ModalHeader, ModalBody, Input, ModalFooter, Button } from "@nextui-org/react";
import { FormEventHandler, useEffect } from "react";
import { toast } from "sonner";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';


export default function UploadFileForm({ isOpen, onOpenChange, onClose }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void, onClose: () => void }) {
    const { data, post, setData, errors, processing, reset } = useForm({
        name: '',
    })
    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading("Creating folder...", {
            position: 'top-right'
        })
        post(route('drive.createFolder'), {
            onSuccess: () => {
                reset('name')
                toast.success("Folder created successfully", {
                    className: 'text-green-500',
                    position: 'top-right'
                })
            },
            onError: () => {
                toast.error("Failed creating folder", {
                    className: 'text-red-500',
                    position: 'top-right'
                })
            },
            onFinish: () => {
                toast.dismiss(loadingToastId)
                onClose()
            }
        })
    }
    const handleFinish = () => {
        router.reload();
        toast.success("File Uploaded", {
            className: 'text-green-500',
            position: 'top-right'
        })
    }
    function generateLink() {
        if (route().params.folderId) {
            return route('drive.uploadFile.folder', { parentId: route().params.folderId })
        }
        return route('drive.uploadFile')
    }
    return <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Upload Files</ModalHeader>
                        <form onSubmit={submit} method="post">
                            <ModalBody>
                                <FilePond onprocessfiles={handleFinish} allowMultiple={true} maxFiles={3} server={generateLink()} credits={false} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" type="submit" isLoading={processing} isDisabled={processing}>
                                    Create
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}