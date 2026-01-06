import { Button } from './button'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <section className='w-full pt-36 md:pt-48 pb-10'>
        <div className='space-y-6 text-center'>
            <div className='space-y-6 mx-auto'>
                <h1>
                    Your AI Career Coach for
                    <br />
                    Professional Success
                </h1>
                <p>
                    Advance your career with personalized guidance , interview prep, 
                    and AI-powered tools for job success.
                </p>
            </div>

            <div>
                <Link href= "/dashboard">
                 <Button size ="ig" className = "px-8">
                    Get Started
                 </Button>
                </Link>
                <Link href= "https://youtu.be/UbXpRv5ApKA?si=gCYEGc-x7APosK2H">
                 <Button size ="ig" className = "px-8" variant="outline">
                    Get Started
                 </Button>
                </Link>
            </div>

            <div>
                <div>
                    <Image
                     src={"/banner.png"}
                     width={1280}
                     height={720}
                     alt='Banner AICoach'
                     className='rounded-lg shadow-2xl border-mx-auto'
                     priority

                    />
                </div>
            </div>
        </div>

     
    </section>
  )
}

export default HeroSection