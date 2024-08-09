import MainLayout from "@/Layouts/MainLayout";
import { Item, User } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { BreadcrumbItem, Breadcrumbs, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, getKeyValue, Input, Pagination, Snippet, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import CreateFolderForm from "./Partials/CreateFolderForm";
import ConfirmDialog from "@/Components/ConfirmDialog";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import UpdateItemForm from "./Partials/UpdateItemForm";
import UploadFileForm from "./Partials/UploadFileForm";
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
export default function Index({ auth, items, parent, allParents }: { auth: { user: User }, parent: Item | null, allParents: Item[], items: { current_page: number, data: Item[], first_page_url: string, from: number, last_page: number, last_page_url: string, links: PaginationLink[], next_page_url: string | null, path: string, per_page: number, prev_page_url: string | null, to: number, total: number } }) {
    const [itemUpdate, setItemUpdate] = useState<Item | null>(null);

    const [searchText, setSearchText] = useState('')

    const createFolder = useDisclosure();
    const updateItem = useDisclosure();
    const uploadFile = useDisclosure();

    const deleteItem = (itemId: string) => {
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
                const loadingToastId = toast.loading("Deleting...", {
                    position: 'top-right'
                })
                try {
                    await deletePromise(itemId)
                    toast.success("Item deleted successfully", {
                        className: 'text-green-500',
                        position: 'top-right'
                    })
                } catch (error) {
                    toast.error("Failed deleting item", {
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

    const deletePromise = (itemId: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            router.delete(route('drive.deleteItem', { itemId: itemId }), {
                onFinish: () => {
                    resolve();
                },
                onError: () => {
                    reject()
                }
            })
        })
    }

    function copyLink(driveLink: string) {
        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(driveLink);
            toast.success("Link copied to clipboard", {
                className: 'text-green-500',
                position: 'top-right'
            })
        } else {
            toast.error("Insecured Context", {
                className: 'text-red-500',
                position: 'top-right'
            })
        }
    }


    function handleDoubleClick(item: Item) {
        if (item.type == 'folder') {
            router.visit(route('drive.index.folder', { folderId: item.itemId }))
        } else {
            window.location.href = item.driveLink;
        }
    }

    function setPaginationNumber(page: number) {
        if (parent) {
            router.visit(route('drive.index.folder', { search: searchText, folderId: parent.itemId, page: page }))
        } else {
            router.visit(route('drive.index', { search: searchText, page: page }))
        }
    }

    useEffect(() => {
        if (route().params.search) {
            setSearchText(route().params.search)
        }
    }, [])

    return <MainLayout auth={auth}>
        <Head title="My Storage" />
        <Breadcrumbs size="lg" maxItems={3} itemsBeforeCollapse={1} itemsAfterCollapse={2}>
            <BreadcrumbItem className="font-bold text-2xl text-slate-700">
                <Link href={route('drive.index')}>My Storage</Link>
            </BreadcrumbItem>
            {
                allParents.map((parent) => (
                    <BreadcrumbItem key={parent.itemId} className="font-bold text-2xl text-slate-700">
                        <Link href={route('drive.index.folder', { folderId: parent.itemId })}>{parent.name}</Link>
                    </BreadcrumbItem>
                ))
            }
            {
                parent ? (
                    <BreadcrumbItem className="font-bold text-2xl text-slate-700" onClick={() => {
                        updateItem.onOpen();
                        setItemUpdate(parent);
                    }}>
                        <div className="flex items-center gap-2 cursor-pointer">
                            {parent.name}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                    </BreadcrumbItem>
                ) : null
            }
        </Breadcrumbs>
        <p className="text-slate-500 text-sm">Upload your files here for seamless access to drive</p>
        <hr className="border-dashed mt-4" />
        <div className="mt-4 flex justify-between items-stretch gap-2">
            <form onSubmit={(e) => {
                e.preventDefault();
                if (parent) {
                    router.visit(route('drive.index.folder', { search: searchText, folderId: parent.itemId }))
                } else {
                    router.visit(route('drive.index', { search: searchText }))
                }
            }} className="max-w-xs">
                <Input type="text" variant={'bordered'} label="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </form>

            <Dropdown>
                <DropdownTrigger>
                    <Button className="h-[56px] bg-green-500 hover:bg-green-800 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                    <DropdownItem onPress={uploadFile.onOpen}>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                            </svg>
                            Upload File
                        </div>
                    </DropdownItem>
                    <DropdownItem onPress={createFolder.onOpen}>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                            </svg>
                            New Folder
                        </div>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <CreateFolderForm isOpen={createFolder.isOpen} onOpenChange={createFolder.onOpenChange} onClose={createFolder.onClose} />
        <UpdateItemForm item={itemUpdate} isOpen={updateItem.isOpen} onOpenChange={updateItem.onOpenChange} onClose={updateItem.onClose} />
        <UploadFileForm isOpen={uploadFile.isOpen} onOpenChange={uploadFile.onOpenChange} onClose={uploadFile.onClose} />
        <Table aria-label="Example table with dynamic content" className="mt-5 overflow-x-auto" isCompact>
            <TableHeader >
                <TableColumn>No</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn className="text-center">Type</TableColumn>
                <TableColumn className="text-center">Visibility</TableColumn>
                <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No items to display."}>
                {
                    items.data.map((item, key) => (
                        <TableRow key={key} className="cursor-pointer" onDoubleClick={() => handleDoubleClick(item)}>
                            <TableCell>{key + 1}</TableCell>
                            <TableCell>
                                <p className="line-clamp-1">{item.name}</p>
                            </TableCell>
                            <TableCell className="text-xs text-slate-500 capitalize text-center">{item.type}</TableCell>
                            <TableCell className="text-xs text-slate-500 capitalize text-center">{item.visibility}</TableCell>
                            <TableCell>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <button className="text-slate-600 rounded hover:bg-slate-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                            </svg>
                                        </button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Static Actions"
                                    >
                                        <DropdownItem textValue="settings" onPress={() => {
                                            updateItem.onOpen();
                                            setItemUpdate(item);
                                        }}>
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                                More
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem textValue="settings" onClick={() => {
                                            copyLink(item.driveLink);
                                        }}>
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                                </svg>
                                                Copy Link
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem textValue="delete" onPress={() => deleteItem(item.itemId)}>
                                            <div className="flex items-center gap-2 text-red-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                                Delete
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
        <div className="flex justify-center mt-5">
            <Pagination onChange={(number) => setPaginationNumber(number)} isCompact showControls total={items.links.length - 2} page={items.current_page} initialPage={1} />
        </div>
    </MainLayout>
}