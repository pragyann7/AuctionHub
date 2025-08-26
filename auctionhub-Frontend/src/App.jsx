import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <div className="group relative">
              <img src="../src/assets/pexels-shakir1317-32124649.jpg" alt="Jet" className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0"></span>
                      Fighter Jet(Unknown)
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Lorem ipsum, dolor sit amet consectetur adipisicing elit <span className='text-blue-700'>...see more</span></p>
                </div>
                <p className="text-2xl font-medium text-gray-900">$35</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
