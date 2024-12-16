'use client'
import { Wallet } from 'lucide-react'
import Link from 'next/link'
import { useBlockchain } from '../Context/BlockchainProvider'

export default function Nav() {
  const { connectWallet, currentUser, isConnected } = useBlockchain()

  const handleConnectWalletClick = async () => {
    console.log("Connect wallet");
    console.log(isConnected);

    await connectWallet();
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gray-900">
      <nav
        className="flex items-center justify-between px-4 py-2 md:py-4 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-lg sm:text-base md:text-2xl lg:text-3xl font-serif text-purple-300 mr-2 sm:mr-4"
          >
            Voting Dapp
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
          <Link
            href="/"
            className="text-sm sm:text-md md:text-base font-serif text-white hover:text-purple-500"
          >
            Home
          </Link>
          <Link
            href="/Dashboard"
            className="text-sm sm:text-md md:text-base font-serif text-white hover:text-purple-500"
          >
            Dashboard
          </Link>
          <Link
            href="/Result"
            className="text-sm sm:text-md md:text-base font-serif text-white hover:text-purple-500"
          >
            Result
          </Link>
        </div>

        {/* Connect Wallet Button */}
        <div className="flex items-center ml-2">
          {isConnected ? (
            <div className="flex items-center text-xs sm:text-sm md:text-base font-semibold text-green-400 border border-green-700 px-2 sm:px-3 py-1 sm:py-2 rounded-md">
              <Wallet className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {currentUser.substring(0, 6)}...{currentUser.slice(-4)}
            </div>
          ) : (
            <button
              onClick={handleConnectWalletClick}
              className="flex items-center text-xs sm:text-sm md:text-base font-semibold text-purple-300 border border-purple-700 hover:bg-purple-900 px-2 sm:px-3 py-1 sm:py-2 rounded-md"
            >
              <Wallet className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Connect
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
