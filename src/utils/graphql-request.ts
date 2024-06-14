type GraphQlError = {
  message: string;
  code: string;
};

export async function request<R>(graphqlUrl: string, query: string) {
  const res = await fetch(graphqlUrl, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify({
      query,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    throw new Error(`GraphQL failed with code: ${res.status}`);
  }

  const body = await res.json();

  if (body.errors) {
    const error = (body.errors as GraphQlError[]).reduce((acc, curr) => {
      return `${acc} [${curr.message}]`;
    }, "GraphQL request failed with the following errors:");

    throw new Error(error);
  }

  return body.data as R;
}
