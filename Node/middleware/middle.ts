import { NextFunction, Request, Response,  } from "express";


export const middle = (req : Request, res: Response, next : NextFunction)=> {
    res.json({
        message: 'Hello from the middleware part-445'
    })
    next();
};




