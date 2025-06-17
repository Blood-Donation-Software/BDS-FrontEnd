import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Shield, Zap } from 'lucide-react';
import Image from 'next/image';

const AboutUs = () => {
    const coreValues = [
        {
            title: 'Tận Tâm',
            description: 'Chúng tôi luôn đặt sự an toàn và sức khỏe của người hiến máu lên hàng đầu, với thái độ tận tâm và chu đáo trong từng dịch vụ.',
            icon: <Heart className="w-8 h-8 text-red-500" />
        },
        {
            title: 'Chuyên Nghiệp',
            description: 'Đội ngũ y bác sĩ giàu kinh nghiệm, quy trình chuẩn quốc tế và trang thiết bị hiện đại đảm bảo chất lượng dịch vụ tốt nhất.',
            icon: <Users className="w-8 h-8 text-red-500" />
        },
        {
            title: 'Minh Bạch',
            description: 'Mọi hoạt động được thực hiện một cách minh bạch, công khai, đảm bảo quyền lợi và sự tin tưởng của người hiến máu.',
            icon: <Shield className="w-8 h-8 text-red-500" />
        },
        {
            title: 'Hiệu Quả',
            description: 'Tinh thần nhân ái, sẻ chia là động lực thúc đẩy chúng tôi không ngừng nỗ lực vì sức khỏe cộng đồng.',
            icon: <Zap className="w-8 h-8 text-red-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Về Chúng Tôi
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Tìm hiểu về sứ mệnh, tầm nhìn và giá trị cốt lõi của chúng tôi
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
                                Tầm Nhìn
                            </h2>
                            <div className="text-base leading-relaxed space-y-2">
                                <p>
                                    Trở thành trung tâm hiến máu hàng đầu Việt Nam, tiên phong trong việc ứng dụng công nghệ hiện đại để quản lý và phân phối máu hiệu quả, đảm bảo nguồn cung máu an toàn và đầy đủ cho toàn xã hội.
                                </p>
                                <p>
                                    Chúng tôi hướng tới việc xây dựng một hệ thống hiến máu bền vững, nơi mọi người dân đều có thể dễ dàng tham gia vào hoạt động hiến máu nhân đạo, góp phần cứu sống hàng triệu người bệnh.
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
                                Sứ Mệnh
                            </h2>
                            <div className="text-base leading-relaxed space-y-2">
                                <p>
                                    Kết nối những trái tim nhân ái với những người cần được cứu giúp thông qua việc tổ chức các hoạt động hiến máu chuyên nghiệp, an toàn và hiệu quả.
                                </p>
                                <p>
                                    Chúng tôi cam kết cung cấp dịch vụ hiến máu chất lượng cao, đảm bảo quy trình khoa học và an toàn tuyệt đối cho người hiến máu, đồng thời quản lý nguồn máu một cách minh bạch và hiệu quả.
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
                        Giá Trị Cốt Lõi
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Những giá trị định hướng và định hình mọi hoạt động
                        của chúng tôi trong hành trình phát triển
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
