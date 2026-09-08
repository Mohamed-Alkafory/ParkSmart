/**
 * ملف بيانات تجريبية (Seed Data)
 * ------------------------------------------
 * الهدف منه: تعبئة الداتابيز ببيانات واقعية بسرعة عشان تقدروا تجربوا
 * المشروع من غير ما تدخلوا كل حاجة يدوي كل مرة.
 *
 * طريقة التشغيل:
 *   node seed.js
 *
 * ⚠️ تحذير: الملف ده بيمسح البيانات القديمة في الـ Collections دي الأول
 * قبل ما يضيف الجديدة، عشان تتجنبوا تكرار البيانات كل مرة تشغله.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./modules/auth/user.model');
const Parking = require('./modules/parkings/parking.model');
const ParkingSpot = require('./modules/spots/spot.model');
const Booking = require('./modules/bookings/booking.model');
const Review = require('./modules/reviews/review.model');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected ✅ - بدء إضافة البيانات التجريبية...\n');

    // 1. مسح البيانات القديمة (عشان نبدأ نضيف بيانات نضيفة كل مرة)
    await User.deleteMany({});
    await Parking.deleteMany({});
    await ParkingSpot.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  البيانات القديمة اتمسحت');

    // 2. إضافة يوزرز تجريبيين (سائقين وأصحاب جراجات)
    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = await User.insertMany([
      { name: 'أحمد محمد', email: 'ahmed@example.com', password: hashedPassword, role: 'driver', phone: '01012345678' },
      { name: 'سارة علي', email: 'sara@example.com', password: hashedPassword, role: 'driver', phone: '01098765432' },
      { name: 'محمود حسن', email: 'mahmoud@example.com', password: hashedPassword, role: 'owner', phone: '01055555555' },
      { name: 'منى إبراهيم', email: 'mona@example.com', password: hashedPassword, role: 'owner', phone: '01066666666' },
    ]);
    console.log(`👤 اتضاف ${users.length} يوزرز (كلمة السر لجميع اليوزرز: 123456)`);

    const [driver1, driver2, owner1, owner2] = users;

    // 3. إضافة جراجات تجريبية بإحداثيات حقيقية في القاهرة
    const parkings = await Parking.insertMany([
      {
        name: 'جراج النادي الأهلي',
        address: 'جزيرة الجيزة، القاهرة',
        ownerId: owner1._id,
        pricePerHour: 10,
        location: { type: 'Point', coordinates: [31.211, 30.0626] },
        rating: 4.5,
      },
      {
        name: 'جراج مول العرب',
        address: 'الشيخ زايد، الجيزة',
        ownerId: owner1._id,
        pricePerHour: 15,
        location: { type: 'Point', coordinates: [30.9497, 30.0271] },
        rating: 4.8,
      },
      {
        name: 'جراج وسط البلد',
        address: 'ميدان التحرير، القاهرة',
        ownerId: owner2._id,
        pricePerHour: 8,
        location: { type: 'Point', coordinates: [31.2357, 30.0444] },
        rating: 4.0,
      },
      {
        name: 'جراج سيتي ستارز',
        address: 'مدينة نصر، القاهرة',
        ownerId: owner2._id,
        pricePerHour: 12,
        location: { type: 'Point', coordinates: [31.3462, 30.0731] },
        rating: 4.3,
      },
    ]);
    console.log(`🅿️  اتضاف ${parkings.length} جراجات`);

    // 4. إضافة أماكن (Spots) لكل جراج - بعضها متاح وبعضها محجوز
    const spotsData = [];
    parkings.forEach((parking, parkingIndex) => {
      const spotsCount = 5; // 5 أماكن لكل جراج
      for (let i = 1; i <= spotsCount; i++) {
        spotsData.push({
          parkingId: parking._id,
          spotNumber: `A${i}`,
          // أول مكان في أول جراجين نخليه "محجوز" عشان نجرب الحالتين
          status: parkingIndex < 2 && i === 1 ? 'booked' : 'available',
        });
      }
    });
    const spots = await ParkingSpot.insertMany(spotsData);
    console.log(`🚗 اتضاف ${spots.length} أماكن (Spots)`);

    // 5. إضافة حجز تجريبي واحد (على أول مكان "محجوز")
    const bookedSpot = spots.find((s) => s.status === 'booked');
    const bookingParking = parkings.find((p) => p._id.equals(bookedSpot.parkingId));

    const booking = await Booking.create({
      userId: driver1._id,
      spotId: bookedSpot._id,
      parkingId: bookedSpot.parkingId,
      startTime: new Date(),
      durationHours: 2,
      totalPrice: bookingParking.pricePerHour * 2,
      status: 'active',
    });
    console.log(`📅 اتضاف حجز تجريبي واحد`);

    // 6. إضافة تقييمات تجريبية
    const reviews = await Review.insertMany([
      { userId: driver1._id, parkingId: parkings[0]._id, rating: 5, comment: 'جراج ممتاز وقريب جداً' },
      { userId: driver2._id, parkingId: parkings[0]._id, rating: 4, comment: 'كويس بس السعر شوية غالي' },
      { userId: driver1._id, parkingId: parkings[1]._id, rating: 5, comment: 'أماكن واسعة وآمنة' },
      { userId: driver2._id, parkingId: parkings[2]._id, rating: 3, comment: 'زحمة أوقات الذروة' },
    ]);
    console.log(`⭐ اتضاف ${reviews.length} تقييمات`);

    console.log('\n✅ خلصنا! الداتابيز فيها دلوقتي بيانات تجريبية جاهزة للاختبار.');
    console.log('\n📝 بيانات تسجيل الدخول للتجربة:');
    console.log('   Email: ahmed@example.com | Password: 123456 (سائق)');
    console.log('   Email: mahmoud@example.com | Password: 123456 (صاحب جراج)');

    process.exit(0);
  } catch (err) {
    console.error('❌ حصل خطأ أثناء إضافة البيانات:', err);
    process.exit(1);
  }
}

seed();
