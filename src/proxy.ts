import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtils";
import { getNewTokenWithRefreshToken } from "./services/auth.service";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokenWithRefreshToken(refreshToken);
    if (!refresh) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("Error refreshing token in middleware:", error);
    return false;
  }
}
export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const decodedAccessToken =
      accessToken &&
      jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
        .data;

    const isValidAccessToken =
      accessToken &&
      jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
        .success;
    let userRole: UserRole | null = null;
    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    }
    const routerOwner = getRouteOwner(pathname);
    const unifySuperAdminAndRole =
      userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;
    userRole = unifySuperAdminAndRole;
    //Proactively refresh token if refresh token exists and access token is expired or about to expire
    if(isValidAccessToken && refreshToken&&(await isTokenExpiringSoon(accessToken))){
        const requestHeaders=new Headers(
        request.headers    
        );
        const response=NextResponse.next({
            request:{
                headers:requestHeaders
            },
           
        })
        try {
            const refreshed=await refreshTokenMiddleware(refreshToken);
            if(refreshed){
                requestHeaders.set("x-token-refreshed","1")
            }
            return NextResponse.next({
                request:{
                    headers:requestHeaders
                },
                 headers:response.headers
            })
        } catch (error) {
            console.error("Error refreshing token:", error);
            
        }
        return response;
    }
    //Rule-1: user is logged in (has token access) and trying to access auth route -> don't allow
    const isAuth = isAuthRoute(pathname);
    if (isAuth && isValidAccessToken) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }
    //Rule-2 User trying to access public route- allow
    if (routerOwner === null) {
      return NextResponse.next();
    }
    //Rule-3: User is not logged in but trying to access protected route -> redirect to login
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    //rule-4: user trying to access common protected route
    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }
    //rule-5:user trying to visit role based protected route but does not have required role=>redirect
    if (
      routerOwner === "ADMIN" ||
      routerOwner === "DOCTOR" ||
      routerOwner === "PATIENT"
    ) {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
      }
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
  }
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
