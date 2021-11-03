async function handleEvent(event) {
  if (event.request.method.toLowerCase() !== "post") {
    return new Response("Only POST requests are allowed.", { status: 405 });
  }

  // This line breaks the ability to read formData below when running
  // locally via miniflare but works in production
  let clonedRequest = new Request(event.request.url, event.request);
  
  let data = await clonedRequest.formData();

  return new Response(
    `Form data "message" = ${JSON.stringify(data.get("message"))}`,
    { status: 200 }
  );
}

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (error) {
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});
