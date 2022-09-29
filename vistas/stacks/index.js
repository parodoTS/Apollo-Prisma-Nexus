import { MyStack } from "./MyStack";
import { App } from "@serverless-stack/resources";

/**
 * @param {App} app
 */
export default function (app) {
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    srcPath: "my-prisma",
  });
  app.stack(MyStack);
}
