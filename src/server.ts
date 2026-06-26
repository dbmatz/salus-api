import Fastify from "fastify";
import { env } from "./env";
import { authController } from "@infra/http/controllers/auth.controller";
import { registerErrorHandler } from "@infra/errors/errorHandler";
import { emotionController } from "@infra/http/controllers/emotion.controller";
import { medicationController } from "@infra/http/controllers/medication.controller";
import { parameterController } from "@infra/http/controllers/parameter.controller";

const app = Fastify({
  logger: env.NODE_ENV === "development",
});

registerErrorHandler(app);

app.register(authController, { prefix: "/auth" });
app.register(emotionController, { prefix: "/emotions" });
app.register(medicationController, { prefix: "/medication" });
app.register(parameterController, { prefix: "/parameter" });

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log(`Server running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
