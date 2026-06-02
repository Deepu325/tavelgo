const mongoose = require('mongoose');
const Ride = require('./models/Ride');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
require('dotenv').config();

async function testLocalPackageScenario() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🧪 Testing Local Package Booking Scenario\n');

    // 1. Find test users
    const customer = await User.findOne({ email: 'deepukc2526@gmail.com' });
    const driver = await User.findOne({ email: 'r2@gmail.com', role: 'driver' });

    if (!customer || !driver) {
      console.log('❌ Test users not found');
      return;
    }

    console.log(`👤 Customer: ${customer.name} (${customer.email})`);
    console.log(`🚗 Driver: ${driver.name} (${driver.email})\n`);

    // 2. Find 5-Seater vehicle
    const vehicle = await Vehicle.findOne({ type: '5-Seater' });
    if (!vehicle) {
      console.log('❌ 5-Seater vehicle not found');
      return;
    }

    console.log(`🚙 Vehicle: ${vehicle.name}`);
    console.log(`📦 Package: ₹${vehicle.localPackageFare} (${vehicle.packageTimeLimit}h / ${vehicle.packageDistanceLimit}km)`);
    console.log(`💰 Extra rates: ₹${vehicle.extraKmRate}/km, ₹${vehicle.extraHourRate}/hour\n`);

    // 3. Create package booking
    console.log('📝 Step 1: Creating Local Package Booking...');
    const ride = await Ride.create({
      customer: customer._id,
      driver: driver._id,
      vehicleType: vehicle.type,
      pickupLocation: {
        address: 'MG Road, Bangalore',
        coordinates: { lat: 12.9716, lng: 77.5946 }
      },
      destination: {
        address: 'Commercial Street, Bangalore',
        coordinates: { lat: 12.9822, lng: 77.6086 }
      },
      fare: vehicle.localPackageFare,
      distance: 70, // Estimated distance
      status: 'accepted', // Skip pending for test
      isPackageBooking: true,
      packageDetails: {
        timeLimit: vehicle.packageTimeLimit,
        distanceLimit: vehicle.packageDistanceLimit,
        extraKmRate: vehicle.extraKmRate,
        extraHourRate: vehicle.extraHourRate,
      },
      startTime: new Date(),
      finalFare: vehicle.localPackageFare, // Initially same as base fare
    });

    console.log(`✅ Booking created: ${ride._id}`);
    console.log(`📍 Route: ${ride.pickupLocation.address} → ${ride.destination.address}`);
    console.log(`💰 Base fare: ₹${ride.fare}\n`);

    // 4. Simulate ride completion with extra charges
    console.log('🚀 Step 2: Starting ride...');
    ride.status = 'ongoing';
    await ride.save();
    console.log('✅ Ride started (Ongoing)\n');

    // 5. Complete ride with extra distance and time
    console.log('🏁 Step 3: Completing ride with extra charges...');
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 10); // 10 hours instead of 8

    ride.endTime = endTime;
    ride.status = 'completed';

    // Calculate actual duration
    const durationMs = ride.endTime - ride.startTime;
    ride.actualDuration = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2));

    // Simulate actual distance (95km instead of 70km estimated)
    ride.actualDistance = 95;

    console.log(`📊 Actual ride metrics:`);
    console.log(`   - Distance: ${ride.actualDistance} km (limit: ${ride.packageDetails.distanceLimit} km)`);
    console.log(`   - Duration: ${ride.actualDuration.toFixed(1)} hours (limit: ${ride.packageDetails.timeLimit} hours)`);

    // Calculate extra charges
    let extraKmCharge = 0;
    let extraTimeCharge = 0;

    if (ride.actualDistance > ride.packageDetails.distanceLimit) {
      const extraKm = ride.actualDistance - ride.packageDetails.distanceLimit;
      extraKmCharge = Math.round(extraKm * ride.packageDetails.extraKmRate);
      console.log(`   - Extra km: ${extraKm} km × ₹${ride.packageDetails.extraKmRate} = ₹${extraKmCharge}`);
    }

    if (ride.actualDuration > ride.packageDetails.timeLimit) {
      const extraHours = ride.actualDuration - ride.packageDetails.timeLimit;
      extraTimeCharge = Math.round(extraHours * ride.packageDetails.extraHourRate);
      console.log(`   - Extra time: ${extraHours.toFixed(1)} hours × ₹${ride.packageDetails.extraHourRate} = ₹${extraTimeCharge}`);
    }

    ride.extraKmCharge = extraKmCharge;
    ride.extraTimeCharge = extraTimeCharge;
    ride.finalFare = ride.fare + extraKmCharge + extraTimeCharge;

    await ride.save();

    // Free the driver
    await User.findByIdAndUpdate(driver._id, { isBusy: false });

    console.log(`\n💰 Final Calculation:`);
    console.log(`   Base fare: ₹${ride.fare}`);
    console.log(`   Extra km charge: ₹${ride.extraKmCharge}`);
    console.log(`   Extra time charge: ₹${ride.extraTimeCharge}`);
    console.log(`   Final total: ₹${ride.finalFare}`);

    // Expected: 1800 + 180 + 400 = 2380
    const expectedTotal = 1800 + 180 + 400;
    if (ride.finalFare === expectedTotal) {
      console.log(`\n✅ SUCCESS: Final fare matches expected total ₹${expectedTotal}`);
    } else {
      console.log(`\n❌ ERROR: Final fare ₹${ride.finalFare} doesn't match expected ₹${expectedTotal}`);
    }

    console.log(`\n📋 Ride Status: ${ride.status.toUpperCase()}`);
    console.log(`👥 Customer earnings: ₹${ride.finalFare}`);
    console.log(`🚗 Driver earnings: ₹${ride.finalFare}`);

    // Cleanup
    await Ride.findByIdAndDelete(ride._id);
    console.log('\n🧹 Test data cleaned up');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testLocalPackageScenario();