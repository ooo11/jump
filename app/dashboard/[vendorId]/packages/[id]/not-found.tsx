
import { FaceFrownIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <HandThumbDownIcon className="w-20 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Whoopsie daisy! It seems you&#39;ve stumbled upon a digital black hole.</p>
    </main>
  );
}