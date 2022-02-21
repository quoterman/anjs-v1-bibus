import "reflect-metadata";

import {config} from "config";
import {app} from "fastify-app";
import {JwtToken} from "models/jwt-token";
import {TempToken} from "models/temp-token";
import {User} from "models/user";
import {UserEmail} from "models/user-email";
import {createConnection} from "typeorm";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

(async () => {
  // DB
  const connection = await createConnection({
    type: "postgres",
    host: "ec2-52-215-225-178.eu-west-1.compute.amazonaws.com",
    port: 5432,
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    username: "uviefsfksicjww",
    password: "328418dbe197a2073b23415f9708905d8faebd1bed7f3b4eb3a2e8c57230924c",
    database: "degpr9drlfguhl",
    entities: [
      User,
      UserEmail,
      TempToken,
      JwtToken
    ],
    synchronize: true,
    logging: true,
  })


  await app.listen(config.http.port, "0.0.0.0");
})();
