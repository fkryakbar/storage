import { Item } from "@/types";
import { useForm } from "@inertiajs/react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Snippet } from "@nextui-org/react";
import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

export default function UpdateItemForm({ isOpen, onOpenChange, onClose, item }: { item: Item | null, isOpen: boolean, onOpenChange: (isOpen: boolean) => void, onClose: () => void }) {
    const { data, patch, setData, errors, processing, reset } = useForm({
        name: item?.name,
        visibility: item?.visibility
    });

    useEffect(() => {
        if (item) {
            setData({
                name: item.name,
                visibility: item.visibility
            })
        }
    }, [item])


    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading("Updating...", {
            position: 'top-right'
        })
        patch(route('drive.updateItem', { itemId: item?.itemId }), {
            onSuccess: () => {
                reset('name')
                toast.success("Updated successfully", {
                    className: 'text-green-500',
                    position: 'top-right'
                })
            },
            onError: () => {
                toast.error("Failed updated item", {
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
    function copyLink(driveLink: string) {
        const textArea = document.createElement("textarea");
        textArea.value = driveLink;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const test = document.execCommand('copy');
            toast.success("Link copied to clipboard", {
                className: 'text-green-500',
                position: 'top-right'
            })
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
    }

    function download() {
        window.location.href = item?.driveLink as string
    }
    return <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Setting</ModalHeader>
                        <form onSubmit={submit} method="post">
                            <ModalBody>
                                <Input variant="bordered" onChange={e => setData('name', e.target.value)} value={data.name} label="Name" isDisabled={processing} isInvalid={errors.name ? true : false} errorMessage={errors.name} />
                                <RadioGroup
                                    label="Select visibility"
                                    color="primary"
                                    value={data.visibility}
                                    onChange={(e) => setData('visibility', e.target.value)}
                                >
                                    <Radio value="private">Private</Radio>
                                    <Radio value="read-only">Read Only</Radio>
                                    <Radio value="public">Public</Radio>
                                </RadioGroup>
                                <Snippet symbol="" onCopy={(e) => copyLink(item?.driveLink as string)} variant="bordered" className="overflow-x-clip">{item?.driveLink}</Snippet>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                {
                                    item?.type == 'file' ? (
                                        <Button color="success" variant="solid" onPress={download} className="text-white font-semibold">
                                            Download
                                        </Button>
                                    ) : null
                                }
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}