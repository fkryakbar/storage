import { router, useForm } from "@inertiajs/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, DropdownItem, Input } from "@nextui-org/react";
import { FormEventHandler, useEffect } from "react";
import { toast } from "sonner";

export default function CreateFolderForm({ isOpen, onOpenChange, onClose }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void, onClose: () => void }) {
    const { data, post, setData, errors, processing, reset } = useForm({
        name: '',
        parentId: ''
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
    useEffect(() => {
        if (route().params.folderId) {
            setData({
                name: '',
                parentId: route().params.folderId
            })
        }

    }, [])



    return <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Create New Folder</ModalHeader>
                        <form onSubmit={submit} method="post">
                            <ModalBody>
                                <Input variant="bordered" onChange={e => setData('name', e.target.value)} value={data.name} label="Folder Name" isDisabled={processing} isInvalid={errors.name ? true : false} errorMessage={errors.name} />
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