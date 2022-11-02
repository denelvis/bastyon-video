import { randomUUID } from "node:crypto";
import express from "express";
import pino from "pino";
import pinoExpress from "express-pino-logger";
import httpContext from "express-http-context";

export const logMiddleware = (module: string) => {
  return pinoExpress({
    logger: module ? pino().child({ module }) : pino(),
    genReqId: function (req: express.Request, res: express.Response) {
      if (req.id) return req.id;
      let id = httpContext.get("X-Request-Id");
      if (id) return id;
      id = randomUUID();
      httpContext.set("X-Request-Id", id);
      return id;
    },
  });
};
