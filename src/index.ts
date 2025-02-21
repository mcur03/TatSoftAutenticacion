import { HttpRequest, InvocationContext } from '@azure/functions';

export async function myFunction(req: HttpRequest, context: InvocationContext) {
    return { body: "Hello, Azure Functions!" };
}
