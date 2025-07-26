'use client'
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/language_context';


const AboutUs = () => {
    const { t } = useLanguage();
    const coreValues = [
        {
            title: t?.aboutUs?.Dedication,
            description:t?.aboutUs?.about?.core_values?.values[0]?.description,
            icon: <Heart className="w-8 h-8 text-red-500" />
        },
        {
            title: t?.aboutUs?.Professionalism,
            description: t?.aboutUs?.about?.core_values?.values[1]?.description,
            icon: <Users className="w-8 h-8 text-red-500" />
        },
        {
            title: t?.aboutUs?.Transparency,
            description: t?.aboutUs?.about?.core_values?.values[2]?.description,
            icon: <Shield className="w-8 h-8 text-red-500" />
        },
        {
            title: t?.aboutUs?.Efficiency,
            description: t?.aboutUs?.about?.core_values?.values[3]?.description,
            icon: <Zap className="w-8 h-8 text-red-500" />
        }
    ];

    return (
            <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {t?.aboutUs?.page_title}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {t?.aboutUs?.page_subtitle}
                        </p>
                    </div>

                    {/* Vision and Mission Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-20">
                        {/* Vision image */}
                        {/* <Card className="border-none overflow-hidden h-[300px]">
                            <CardContent className="p-0 h-full">
                                <img
                                    src="/aboutus1.jpg"
                                    alt="Vision"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </CardContent>
                        </Card> */}

                        <Image
                            width={50}
                            height={50}
                            src="/aboutus2.webp"
                            alt="Vision"
                            className="w-full h-full object-cover rounded-lg"
                        />

                        {/* Vision Card */}
                        <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 h-auto">
                            <CardContent className="p-4 sm:p-6">
                                <h2 className="text-3xl font-bold mb-3">
                                    {t?.aboutUs?.about?.vision?.title}
                                </h2>
                                <div className="text-base leading-relaxed space-y-2">
                                    <p>
                                        {t?.aboutUs?.about?.vision?.content[0]}
                                    </p>
                                    <p>
                                        {t?.aboutUs?.about?.vision?.content[1]}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-20">

                        {/* Mission Card */}
                        <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 h-auto">
                            <CardContent className="p-4 sm:p-6">
                                <h2 className="text-3xl font-bold mb-3">
                                    {t?.aboutUs?.about?.mission?.title}
                                </h2>
                                <div className="text-base leading-relaxed space-y-2">
                                    <p>
                                        {t?.aboutUs?.about?.mission?.content[0]}
                                    </p>
                                    <p>
                                        {t?.aboutUs?.about?.mission?.content[1]}
                                    </p>
                                    
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mission Image */}
                        {/* <Card className="border-none overflow-hidden h-[300px]">
                            <CardContent className="p-0 h-full">
                                <img
                                    src="/aboutus1.jpg"
                                    alt="Mission"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </CardContent>
                        </Card> */}
                        <Image
                            width={50}
                            height={50}
                            src="/aboutus1.jpg"
                            alt="Mission"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>

                    {/* Core Values Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {t?.aboutUs?.about?.core_values?.title}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {t?.aboutUs?.about?.core_values?.subtitle}
                        </p>
                    </div>

                    {/* Core Values Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreValues.map((value, index) => (
                            <Card
                                key={index}
                                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-red-200"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="mb-4 flex justify-center">
                                        <div className="p-3 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors duration-300">
                                            {value.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

export default AboutUs;
