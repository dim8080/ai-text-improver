import { Request, Response } from "express"

class BaseController
{
    constructor() {}
 
    protected async handleRequest(
        action: (data: any, params: any, query: any) => Promise<any>,
        req: Request,
        res: Response,
        validationSchema?: any // Could potentially pass validation schema here...
    ): Promise<void> {
        try {
            // Maybe we should validate the request here???
            // We can use Joi or Zod for this, using the validateRequest method
            const result = await action(req.body, req.params, req.query);
            res.status(result.status || 200).json(result);
        } catch (error) {
            console.error('Request handler error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    private async validateRequest(body: any, schema?: any) {
        if (!schema) return body;
        
        const { error, value } = schema.validate(body);
        if (!error) return value;

        const formattedErrors: Record<string, any> = {};
        error.details.forEach((detail: any) => {
            const { key } = detail.context;
            const { message } = detail;
            
            formattedErrors[key] = formattedErrors[key] || {};
            formattedErrors[key].__errors = formattedErrors[key].__errors || [];
            formattedErrors[key].__errors.push(message);
        });

        return { errors: formattedErrors };
    }

    private async handleError(error: any, res: Response): Promise<void> {
        const status = error.status || 500;
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(status).json({ error: message });
      
    }
}

export default BaseController;