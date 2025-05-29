import { stackMiddlewares } from "@/middlewares/stackHandler";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { mainPageMiddleware } from "@/middlewares/main-page-middleware";

const middlewares = [mainPageMiddleware, authMiddleware];

export default stackMiddlewares(middlewares);

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"], // фильтруем только реальные страницы
};
