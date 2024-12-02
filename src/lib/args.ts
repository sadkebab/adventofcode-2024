import { z } from "zod";

const ArgsSchema = z
  .tuple(
    [
      z.string({
        message: "Runner path is required",
      }),
      z.string({
        message: "Script path is required",
      }),
      z.string({
        message: "Input dir is required",
      }),
      z.enum(["full", "sample"], {
        message: "Mode is required",
      }),
      z.enum(["all"]).or(z.coerce.number()),
    ],
    {
      errorMap: (issue, ctx) => {
        if (issue.code === "too_small") {
          return {
            message: `
              Usage:
                bun run src/index.ts <dir> <mode> [day]
            `,
          };
        }

        return { message: ctx.defaultError };
      },
    }
  )
  .rest(z.string())
  .transform(([runnerPath, scriptPath, target, mode, day]) => ({
    runnerPath,
    scriptPath,
    target,
    mode,
    day: day === "all" ? undefined : Number(day),
  }));

export function args() {
  const safeParse = ArgsSchema.safeParse(process.argv);
  if (!safeParse.success) {
    throw new Error(safeParse.error.errors.map((e) => e.message).join("\n"));
  }
  return safeParse.data;
}
