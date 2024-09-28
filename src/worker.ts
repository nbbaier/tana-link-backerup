import { Hono } from "hono";

type Bindings = {
	MY_BUCKET: R2Bucket;
	tana_storage: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) =>
	c.json({
		"PUT /:key": "Put value into the bucket",
		"GET /:key": "Retrieve a key",
	}),
);

app.post("/:key", async (c) => {
	const key = c.req.param("key");
	const value = await c.req.json();
	try {
		await c.env.tana_storage.put(key, value);
		return c.text(`Success writing to ${key}`, 200);
	} catch (err) {
		return c.text(`${err}`, 404);
	}
});

app.get("/:key", async (c) => {
	const key = c.req.param("key");
	const value = await c.env.tana_storage.get(key);
	if (value === null) {
		return c.body(`Object ${key} not found`, 404);
	}
	return c.body(value, {
		status: 200,
	});
});

export default app;
