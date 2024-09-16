// auth middleware
// import { useAuthStore } from "@/stores/auth";
import supabase from "@/supabase";
import { NavigationGuardNext, RouteLocationNormalizedLoaded } from "vue-router";

export default async function auth(to: RouteLocationNormalizedLoaded, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) {

  const user = await supabase.auth.getUser();
  if (user.error !== null) {
    if (to.path === "/login" || to.path === "/register") {
      return next();
    }
    return next({ name: 'Login' });
  }

  if (to.path === "/login" || to.path === "/register") {
    return next(from);
  }

  return next();
}
