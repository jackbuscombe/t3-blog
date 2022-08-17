import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

function RegisterPage() {
	const { handleSubmit, register } = useForm<CreateUserInput>();
	const router = useRouter();

	const { mutate, mutateAsync, error } = trpc.useMutation(["users.register-user"], {
		onSuccess: () => {
			router.push("/login");
		},
	});

	const onSubmit = (values: CreateUserInput) => {
		mutate(values);
	};

	return (
		<>
			<form className="flex flex-col space-y-1" onSubmit={handleSubmit(onSubmit)}>
				{error && error.message}

				<h1 className="text-lg font-bold">Register</h1>

				<input className="border p-1" type="email" placeholder="jane.doe@exmaple.com" {...register("email")} />
				<br />
				<input className="border p-1" type="text" placeholder="John" {...register("name")} />

				<button type="submit">Register</button>
			</form>

			<Link className="bg-purple-500" href="/login">
				Login
			</Link>
		</>
	);
}
export default RegisterPage;
