import MainLayout from "@/Layouts/MainLayout";
import { User } from "@/types";
import { Head } from "@inertiajs/react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, getKeyValue, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import CreateFolderForm from "./Partials/CreateFolderForm";

export default function Index({ auth }: { auth: { user: User } }) {
    const createFolder = useDisclosure();
    return <MainLayout auth={auth}>
        <Head title="Drive" />
        <h1 className="font-bold text-3xl text-slate-700">Drive</h1>
        <p className="text-slate-500">Upload your files here for seamless access to drive</p>
        <hr className="border-dashed mt-4" />
        <div className="mt-4 flex justify-between items-stretch gap-2">
            <Input type="text" variant={'bordered'} label="Search" className="max-w-xs" />
            <Dropdown>
                <DropdownTrigger>
                    <Button className="h-[56px] bg-green-500 hover:bg-green-800 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                    <DropdownItem key="new">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                            </svg>
                            Upload File
                        </div>
                    </DropdownItem>
                    <DropdownItem key="copy">
                        <div onClick={createFolder.onOpen} className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                            </svg>
                            New Folder
                        </div>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <CreateFolderForm isOpen={createFolder.isOpen} onOpenChange={createFolder.onOpenChange} />
        <Table aria-label="Example table with dynamic content" className="mt-5">
            <TableHeader >
                <TableColumn>No</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody >
                <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>Halo</TableCell>
                    <TableCell>Folder</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </MainLayout>
}