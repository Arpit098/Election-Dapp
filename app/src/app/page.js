import Nav from "./components/Navbar"
import { Hero } from "./Components/Hero"

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-900">
      <Nav/>
      <Hero />
    </div>
  )
}
