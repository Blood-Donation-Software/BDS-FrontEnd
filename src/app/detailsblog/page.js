'use client';

import Link from 'next/link';
import ArticleCard from '@/app/detailsblog/ArticleCard';
import Image from 'next/image';


const relatedArticles = [
  {
    category: 'Education',
    title: 'Understanding Anxiety Disorders in Healthcare Settings',
    description: 'Learn how to recognize and support patients experiencing anxiety at the hospital scale.'
  },
  {
    category: 'Guidelines',
    status: 'Status',
    title: 'Trauma-Informed Care: Best Practices for Healthcare Providers',
    description: 'Essential guidelines for implementing trauma-informed approaches in medical settings...'
  },
  {
    category: 'Guidelines',
    title: 'Understanding Anxiety Disorders in Healthcare Settings',
    description: 'Practical examples to identify and assist patients showing signs of clinical anxiety during procedures.'
  },
  {
    category: 'Guidelines',
    status: 'Status',
    title: 'Trauma-Informed Care: Best Practices for Healthcare Providers',
    description: 'How to create a safe environment for patients with PTSD or trauma history.'
  }
];

export default function DetailBlogPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <Link href="/blog">
        <span className="text-sm text-red-600 hover:underline">&larr; Back to Blog</span>
      </Link>

      {/* Main Grid Layout */}
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        {/* Left Column (Main Content) */}
        <div className="flex-1">
           {/* Featured Image */}
          
<div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
  <Image
    src="/mentala.png" 
    alt="Mental Health Awareness"
    fill
    className="object-cover"
    priority
  />
</div>
          {/* Title & Meta */}
          <div>
            <p className="bg-green-600 text-white font-medium px-3 py-1 rounded-md w-fit">
              Health
            </p>

            <h1 className="text-3xl font-bold mt-2">
              Mental Health Awareness: Breaking the Stigma in Healthcare
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Understanding the importance of mental health support in medical settings and how healthcare providers can create more inclusive environments for patients struggling with mental health challenges.
            </p>
          </div>

          {/* Authors */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 text-white font-bold flex items-center justify-center rounded-full mr-3">
                AW
              </div>
              <div>
                <p className="font-medium">Dr. Aude Williams</p>
                <p className="text-sm text-gray-500">Chief of Psychiatry, Mental Health Services</p>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 text-white font-bold flex items-center justify-center rounded-full mr-3">
                MW
              </div>
              <div>
                <p className="font-medium">Dr. Mark Wilkins</p>
                <p className="text-sm text-gray-500">
                  Chief of Psychiatry, Mental Health Services<br />
                  Dr. Wilkins is a board-certified specialist with over 20 years of experience in mental health advocacy and patient care. She specializes in trauma-informed care and healthcare system reforms.
                </p>
              </div>
            </div>
          </div>

          {/* Horizontal divider */}
          <hr className="my-6 border-gray-200" />

          {/* Main Content */}
          <div className="space-y-6 text-gray-800">
            <p>
              Mental health has become an increasingly important topic in healthcare, yet stigma and misunderstanding continue to create barriers for patients seeking help. As healthcare providers, we have a responsibility to create environments where mental health is treated with the same urgency and compassion as physical health conditions.
            </p>

            <h2 className="text-2xl font-semibold mt-8">Understanding Mental Health Stigma</h2>
            <p>
              Mental health stigma manifests in various ways within healthcare settings. Patients may feel judged, dismissed, or misunderstood when discussing their mental health concerns. This stigma can prevent individuals from seeking help, leading to worsening conditions and decreased quality of life.
            </p>

            <h2 className="text-2xl font-semibold mt-8">Common Misconceptions</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Mental health conditions are a sign of personal weakness</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>People can simply 'snap out of' depression or anxiety</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Mental health issues are not 'real' medical conditions</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Seeking help for mental health means you are 'crazy'</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Mental health problems only affect certain types of people</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column (Related Articles) */}
        <div className="md:w-80 lg:w-96 flex-shrink-0">
          <div className="sticky top-6">
            <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
            <div className="space-y-4">
              {relatedArticles.map((item, idx) => (
                <ArticleCard key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
