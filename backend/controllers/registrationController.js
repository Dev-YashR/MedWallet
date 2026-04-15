const Registration = require("../models/registerSchema");

const createRegistration = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      name,
      email,
      school,
      grade,
      referral,
      abhaId,
      isAbhaLinked,
      mobile,
      dob,
      gender,
      bloodGroup,
      address,
    } = req.body;

    let resolvedFirstName = firstName;
    let resolvedLastName = lastName;

    if (!resolvedFirstName && name) {
      const nameParts = name.trim().split(/\s+/);
      resolvedFirstName = nameParts.shift() || '';
      resolvedLastName = nameParts.join(' ');
    }

    const registrationSchool = school || 'MediVault Patient';
    const registrationGrade = grade || 'N/A';
    const registrationReferral = referral || abhaId || mobile || 'patient_signup';

    if (!resolvedFirstName || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name and email are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email sahi nahi hai.'
      });
    }

    const newRegistration = new Registration({
      firstName: resolvedFirstName,
      lastName: resolvedLastName || '',
      email,
      school: registrationSchool,
      grade: registrationGrade,
      referral: registrationReferral,
      abhaId: abhaId || '',
      isAbhaLinked: Boolean(isAbhaLinked),
      mobile: mobile || '',
      dob: dob || '',
      gender: gender || '',
      bloodGroup: bloodGroup || '',
      address: address || '',
    });

    await newRegistration.save();

    res.status(201).json({
      success: true,
      message: "Registration ho gaya! 🎉"
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Yeh email pehle se registered hai."
      });
    }

    console.log("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Server mein kuch problem hai. Baad mein try karo."
    });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const all = await Registration.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: all.length,
      data: all
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error aaya." });
  }
};

module.exports = { createRegistration, getAllRegistrations };