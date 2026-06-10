import { redirect } from "next/navigation";

// `/plans` previously re-exported the pricing page, producing duplicate content
// at two URLs. Redirect to the canonical `/pricing` instead.
export default function PlansPage() {
  redirect("/pricing");
}
