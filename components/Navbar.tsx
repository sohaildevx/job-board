import Link from "next/link"
import Image from "next/image"
export default function Navbar(){
    return (
        <nav className="bg-white shadow-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <Link href={"/"} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <Image  src="/logo.png"
                          alt="Job Board Logo"
                          width={32}
                            height={32}
                            className="rounded"
                        />
                        <span className="text-xl font-bold text-gray-800">Job Board</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link href={"/jobs"} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                             Browse Jobs
                        </Link>
                        <Link href={"/jobs/post"} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                             Post a Job
                        </Link>
                        <Link href={"/dashboard"} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                             Dashboard
                        </Link>

                        <Link href={"/auth/signIn"}> 
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                Sign In
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}