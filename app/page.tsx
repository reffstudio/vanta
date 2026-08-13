import { HomePage } from "@/components/home-page"
import { getProjects } from "@/sanity/fetch-projects"

export const dynamic = "force-dynamic"

export default async function Page() {
  const projects = await getProjects()
  return <HomePage projects={projects} />
}
