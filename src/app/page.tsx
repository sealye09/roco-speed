'use client';

import { ModeToggle } from '~/components/mode-toggle';
import { PetTable } from '~/components/pet-table';
import { pets } from '~/data/pets';

const petsArr = Object.values(pets);

export default function Home() {
  return (
    <div>
      <div className='flex justify-end px-4 py-2'>
        <ModeToggle />
      </div>

      <main className='container mx-auto py-10'>
        <PetTable pets={petsArr} />
      </main>
    </div>
  );
}
