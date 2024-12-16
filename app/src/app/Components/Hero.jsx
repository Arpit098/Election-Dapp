'use client'
import { useState } from 'react'
import { Typewriter } from 'react-simple-typewriter'
import { CandidateModal } from "./CandidateModal"
import { UserModal } from "./UserModal"
import Link from 'next/link'
export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false) //for candidate
  const handleModalClose = () => setIsModalOpen(false)
  
  const [isModalOpenUser, setIsModalOpenUser] = useState(false) //for user
  const handleModalCloseUser = () => setIsModalOpenUser(false)


  return (
    <div className="flex-1 flex items-center justify-center bg-gray-900">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold  tracking-tight text-white sm:text-6xl">
            Welcome to a platform where you can{' '}
            <span className="text-purple-300">
              <Typewriter
                words={['vote.', 'be heard.', 'make a difference.', 'become a leader.']}
                loop={Infinity}
                typeSpeed={60}
                deleteSpeed={40}
                delaySpeed={2000}
              />
            </span>
          </h1>
          <p className="mt-6 text-lg font-sans leading-8 text-gray-300">
            Participate in a decentralized voting system where every vote counts. 
            Register as a user to cast your vote or become a candidate and stand for election. 
            Shape the future of decision-making today!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={()=> setIsModalOpen(true)}
              className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Become a Candidate
            </button>
            <button
              onClick={()=> setIsModalOpenUser(true)}
              className="rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Register as User
            </button>
          </div>

          <div className="mt-16 sm:mb-8 sm:flex sm:justify-center">
            <div className="relative font-sans rounded-full px-3 py-1 text-sm/6 text-white ring-1 ring-purple-600 ">
              Check out the Dashboard for more information.{" "}
              <Link href="/Dashboard" className="font-semibold text-purple-300 hover:text-purple-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Let's Go <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
      <CandidateModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
      <UserModal 
        isOpen={isModalOpenUser}
        onClose={handleModalCloseUser}
      />
    </div>
  )
}
