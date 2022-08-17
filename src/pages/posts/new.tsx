import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../schema/post.schema";
import { trpc } from "../../utils/trpc";

function CreatePostPage() {
	const router = useRouter();
	const { handleSubmit, register } = useForm<CreatePostInput>();

	const { mutate, error } = trpc.useMutation(["posts.create-post"], {
		onSuccess: ({ id }) => {
			router.push(`/posts/${id}`);
		},
	});

	function onSubmit(values: CreatePostInput) {
		mutate(values);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{error && error.message}

			<h1>Create Posts</h1>

			<input type="text" placeholder="Your post title" {...register("title")} />
			<br />
			<textarea placeholder="Your post description" {...register("body")} />
			<br />
			<button>Create Post</button>
		</form>
	);
}
export default CreatePostPage;
