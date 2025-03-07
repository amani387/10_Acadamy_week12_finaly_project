import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-center space-x-4">
      <Link href="/">Home</Link>
      <Link href="/portfolio">Portfolio Optimizer</Link>
    </nav>
  );
}
