import type { NextRequest } from "next/server";
import { notFound, withApi } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ userId: string }> };

// GET /api/v1/avatars/:userId - devolve a imagem do avatar.
export const GET = withApi(async (_request: NextRequest, context: Context) => {
  const { userId } = await context.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarData: true, avatarMime: true },
  });
  if (!user?.avatarData || !user.avatarMime) {
    return notFound("Avatar não encontrado.");
  }

  return new Response(Buffer.from(user.avatarData), {
    status: 200,
    headers: {
      "Content-Type": user.avatarMime,
      "Content-Length": String(user.avatarData.byteLength),
      // Sempre revalida: depois de um reset a imagem pode ter mudado.
      "Cache-Control": "private, no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
