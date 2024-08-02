import Gradient from "@/Components/Gradient";
import { Head, useForm } from "@inertiajs/react";
import { Button, Input } from "@nextui-org/react";
import { FormEventHandler } from "react";

export default function Login() {
    const { data, post, errors, processing, setData } = useForm({
        email: '',
        password: '',
    })
    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('loginAttempt'));

    }

    return <>
        <Head title="Login" />
        <Gradient />
        <main className="flex h-screen items-center justify-center">
            <div className="bg-white p-5 rounded border-slate-100 border-1 shadow max-w-sm">
                <h1 className="text-green-500 font-bold text-5xl text-center">eStorage</h1>
                <p className="text-gray-600 font-semibold text-center mt-4">Storage management with seamless integration with GDrive</p>
                <form onSubmit={submit} className="mt-3 flex flex-col gap-3" autoComplete="off" autoCorrect="off">
                    <Input type="text" onChange={(e) => setData('email', e.target.value)} variant={'bordered'} value={data.email} label="Email" placeholder="Enter your email" isDisabled={processing} isInvalid={errors.email ? true : false} errorMessage={errors.email} />
                    <Input type="password" onChange={(e) => setData('password', e.target.value)} value={data.password} variant={'bordered'} label="Password" placeholder="Enter your password" isDisabled={processing} isInvalid={errors.password ? true : false} errorMessage={errors.password} />
                    <Button className="bg-green-500 uppercase font-bold text-white hover:bg-green-800" type="submit" isLoading={processing} isDisabled={processing}>
                        Login
                    </Button>
                </form>
            </div>
        </main>
    </>
}