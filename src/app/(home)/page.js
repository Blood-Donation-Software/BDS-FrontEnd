import CallToAction from "@/sections/CallToAction/CallToAction";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  
  return (
    <>
      <CallToAction />
      
      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-600">Tác Động Của Chúng Tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-5xl font-bold text-red-600 mb-2">10,000+</h3>
              <p className="text-gray-600">Lượt hiến máu</p>
            </div>
            <div className="p-6">
              <h3 className="text-5xl font-bold text-red-600 mb-2">50+</h3>
              <p className="text-gray-600">Đợt vận động</p>
            </div>
            <div className="p-6">
              <h3 className="text-5xl font-bold text-red-600 mb-2">5,000+</h3>
              <p className="text-gray-600">Bệnh nhân được cứu</p>
            </div>
            <div className="p-6">
              <h3 className="text-5xl font-bold text-red-600 mb-2">24/7</h3>
              <p className="text-gray-600">Hỗ trợ khẩn cấp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-600">Quy Trình Hiến Máu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Đăng Ký</h3>
              <p className="text-gray-600">Điền thông tin và kiểm tra điều kiện sức khỏe ban đầu</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Khám Sàng Lọc</h3>
              <p className="text-gray-600">Kiểm tra sức khỏe và xét nghiệm máu cơ bản</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Hiến Máu</h3>
              <p className="text-gray-600">Quá trình hiến máu diễn ra trong khoảng 10-15 phút</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-600">Câu Chuyện Cảm Động</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">TN</span>
                </div>
                <div>
                  <h4 className="font-semibold">Trần Ngọc Anh</h4>
                  <p className="text-gray-500 text-sm">Người hiến máu thường xuyên</p>
                </div>
              </div>
              <p className="text-gray-700 italic">&quotHiến máu không chỉ giúp người khác mà còn giúp tôi cảm thấy mình có ích hơn. HopeWell luôn tạo điều kiện tốt nhất cho người hiến máu.&quot</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">LV</span>
                </div>
                <div>
                  <h4 className="font-semibold">Lê Văn Bình</h4>
                  <p className="text-gray-500 text-sm">Người nhận máu</p>
                </div>
              </div>
              <p className="text-gray-700 italic">&quotNhờ có máu từ HopeWell, tôi đã vượt qua ca phẫu thuật nguy hiểm. Cảm ơn tất cả những người hiến máu đã cứu sống tôi.&quot</p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA Section */}
      <section className="py-16 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Bạn Có Thể Cứu Sống Ai Đó Hôm Nay</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Chỉ với 15 phút hiến máu, bạn có thể mang lại cơ hội sống cho 3 người
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" className="border-white text-red-600 hover:bg-red-700 hover:text-white px-8 py-6 text-lg font-semibold">
              Đăng Ký Hiến Máu Ngay
            </Button>
            <Button variant="secondary" className="border-white text-red-600 hover:bg-red-700 hover:text-white px-8 py-6 text-lg font-semibold">
              Liên Hệ Chúng Tôi
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}