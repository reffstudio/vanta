import { HomePage } from "@/components/home-page"
import { getProjects } from "@/sanity/fetch-projects"

export default async function Page() {
  const projects = await getProjects()
  return <HomePage projects={projects} />
}
