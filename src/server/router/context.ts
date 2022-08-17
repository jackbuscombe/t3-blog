// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";

import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import { verifyJwt } from "../../utils/jwt";
import { prisma } from "../db/client";

interface CtxUser {
	id: string;
	email: string;
	name: string;
	iat: string;
	exp: number;
}

function getUserFromRequest(req: NextApiRequest) {
	const token = req.cookies.token;

	if (token) {
		try {
			const verified = verifyJwt<CtxUser>(token);
			return verified;
		} catch (error) {
			return null;
		}
	}

	return null;
}

export const createContext = async (opts?: trpcNext.CreateNextContextOptions) => {
	const req = opts?.req;
	const res = opts?.res;

	const session = req && res && (await getServerSession(req, res, nextAuthOptions));

	const user = getUserFromRequest(req as NextApiRequest);

	return {
		req,
		res,
		session,
		prisma,
		user,
	};
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
