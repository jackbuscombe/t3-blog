import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

function VerifyToken({ hash }: { hash: string }) {
	const router = useRouter();
	const { data, isLoading } = trpc.useQuery([
		"users.verify-otp",
		{
			hash,
		},
	]);

	if (isLoading) {
		return <p>Verifying...</p>;
	}

	router.push(data?.redirect.includes("login") ? "/" : data?.redirect || "/");

	return <p>Redirection...</p>;
}

function LoginForm() {
	const { handleSubmit, register } = useForm<CreateUserInput>();
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const { mutate, mutateAsync, error } = trpc.useMutation(["users.request-otp"], {
		onSuccess: () => {
			setSuccess(true);
		},
	});

	const onSubmit = (values: CreateUserInput) => {
		mutate({ ...values, redirect: router.asPath });
	};

	const hash = router.asPath.split("#token=")[1];

	if (hash) {
		return <VerifyToken hash={hash} />;
	}

	return (
		<>
			<form className="flex flex-col space-y-2" onSubmit={handleSubmit(onSubmit)}>
				{error && error.message}

				{success && <p>Check your email</p>}

				<h1 className="text-lg font-bold">Login</h1>

				<input type="email" placeholder="jane.doe@exmaple.com" {...register("email")} />

				<button className="bg-purple-500">Login</button>
			</form>

			<Link className="bg-purple-500" href="/register">
				Register
			</Link>
		</>
	);
}
export default LoginForm;
