import { NextFunction, Request, Response } from "express";
import onHeaders from "on-headers";

import { promReqHistogram } from "../../server";

export default function responseTime() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path === "/metrics") {
      return next();
    }

    const end = promReqHistogram.startTimer();

    onHeaders(res, () => {
      end({
        method: req.method,
        status_code: res.statusCode,
        route: req.route ? req.route.path : "UNDEFINED",
      });
    });

    next();
  };
}
