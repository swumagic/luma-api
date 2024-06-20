import type { RequestHandler, RequestEvent } from './$types';
import { json } from '@sveltejs/kit';
import { config } from '$lib/config';

const access_token = config.ACCESS_TOKEN;
const baseUrl = config.API_URL + '/api/photon/v1/generations/';

export const GET = (async ({ params }: RequestEvent) => {
	if (!access_token) return json({ message: 'Missing access token' }, { status: 400 });

	const { id } = params;
	if (!id) return json({ message: 'Missing required parameter: id' }, { status: 400 });

	try {
		const res = await fetch(`${baseUrl}${id}`, {
			method: 'GET',
			headers: {
				Cookie: `access_token=${access_token}`
			}
		});

		if (!res.ok) {
			const error = await res.json();
			throw new Error(error?.detail?.reason ?? error?.detail ?? 'Failed to fetch data');
		}

		const data = await res.json();
		return json({ data }, { status: 200 });
	} catch (error: any) {
		return json({ message: error?.message || 'Internal Server Error' }, { status: 500 });
	}
}) satisfies RequestHandler;
