import { User } from "@/types";
import { Link } from "@inertiajs/react";
import { Navbar, NavbarContent, NavbarMenuToggle, NavbarBrand, NavbarItem, Button, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { useState } from "react";

export default function MainLayout({ auth, children }: { children: React.ReactNode, auth: { user: User } }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>
            <Navbar onMenuOpenChange={setIsMenuOpen} isBordered={true} isBlurred={true} className="lg:hidden block">
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <p className="text-green-500 font-bold text-xl text-center">eStorage</p>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarMenu>
                    <NavbarMenuItem >
                        <Menu name={auth.user.name} />
                    </NavbarMenuItem>
                </NavbarMenu>
            </Navbar>
            <div className="flex lg:w-[60%] w-[90%] mx-auto lg:mt-20 mt-10 gap-3">
                <div className="basis-[20%] lg:block hidden">
                    <Menu name={auth.user.name} />
                </div>
                <div className="lg:basis-[80%] basis-[100%]">
                    {children}
                </div>
            </div>
        </>
    );
}

function Menu({ name }: { name: string }) {
    return <>
        <p className="text-green-500 font-bold text-4xl">eStorage</p>
        <p className="text-slate-500 font-semibold">{name}</p>
        <div className="flex flex-col gap-2 mt-8">
            <Link href="/drive">
                <div className="hover:bg-gray-100 p-2 rounded-md flex gap-2 items-center text-slate-600 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                    Drive
                </div>
            </Link>
            <Link href="/drive">
                <div className="hover:bg-gray-100 p-2 rounded-md flex gap-2 items-center text-slate-600 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                    Storage
                </div>
            </Link>
            <Link href="/drive">
                <div className="hover:bg-gray-100 p-2 rounded-md flex gap-2 items-center text-slate-600 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                    Logout
                </div>
            </Link>
        </div>
    </>
}