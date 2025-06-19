import { env } from "next-runtime-env";

export const BASE_URL = env('NEXT_PUBLIC_API_URL')
export const AVATAR_URL = env('NEXT_PUBLIC_AVATAR_URL');
// export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;