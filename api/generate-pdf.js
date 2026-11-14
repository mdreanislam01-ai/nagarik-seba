import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const PDF_API_KEY = process.env.PDF_API_KEY || 'BHAPI-0745ff16433260b343d577c28b34ea7b05f217599ceb3f8e';

  // যেকোনো ফরম্যাটের তারিখ (যেমন: 12 February 2006 বা 12/02/2006) থেকে YYYY-MM-DD তে রূপান্তর
  const normalizeDate = (dt) => {
    if (!dt) return '';
    const s = String(dt).trim();
    if (!s) return '';

    // ইতিমধ্যে YYYY-MM-DD হলে
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    // DD/MM/YYYY বা DD-MM-YYYY হলে
    const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmy) {
      return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
    }

    // "12 February 2006" বা "February 12, 2006" ফরম্যাট হলে
    const months = {
      january: '01', jan: '01', february: '02', feb: '02', march: '03', mar: '03',
      april: '04', apr: '04', may: '05', june: '06', jun: '06',
      july: '07', jul: '07', august: '08', aug: '08', september: '09', sep: '09', sept: '09',
      october: '10', oct: '10', november: '11', nov: '11', december: '12', dec: '12'
    };

    const textMatch = s.match(/^(\d{1,2})\s+([a-zA-Z]+)[,\s]+(\d{4})$/);
    if (textMatch) {
      const m = months[textMatch[2].toLowerCase()];
      if (m) return `${textMatch[3]}-${m}-${textMatch[1].padStart(2, '0')}`;
    }

    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }

    return '';
  };

  try {
    const payload = req.body || {};
    const cleanBrn = String(payload.birthRegNumber || '').replace(/\D/g, '');

    if (cleanBrn.length !== 17) {
      return res.status(422).json({
        success: false,
        message: `Birth Registration Number অবশ্যই ১৭ ডিজিটের হতে হবে (বর্তমানে ${cleanBrn.length} ডিজিট আছে)।`
      });
    }

    const dobIso = normalizeDate(payload.dateOfBirth);
    if (!dobIso) {
      return res.status(422).json({
        success: false,
        message: 'জন্ম তারিখ সঠিক ফরম্যাটে নেই (YYYY-MM-DD বা DD/MM/YYYY দিন)।'
      });
    }

    const requestBody = {
      birthRegNumber: cleanBrn,
      dateOfBirth: dobIso,
      personNameBn: String(payload.personNameBn || '').trim(),
      personNameEn: String(payload.personNameEn || '').trim() || 'N/A',
      sex: String(payload.sex || '').toUpperCase() === 'FEMALE' ? 'Female' : 'Male',
      registrationOffice: String(payload.registrationOffice || '').trim(),
      officeLocation: String(payload.officeLocation || '').trim(),
      registrationDate: normalizeDate(payload.registrationDate),
      issuanceDate: normalizeDate(payload.issuanceDate),
      motherNameBn: String(payload.motherNameBn || '').trim(),
      motherNameEn: String(payload.motherNameEn || '').trim(),
      motherNationalityBn: String(payload.motherNationalityBn || 'বাংলাদেশী').trim(),
      motherNationalityEn: String(payload.motherNationalityEn || 'Bangladeshi').trim(),
      fatherNameBn: String(payload.fatherNameBn || '').trim(),
      fatherNameEn: String(payload.fatherNameEn || '').trim(),
      fatherNationalityBn: String(payload.fatherNationalityBn || 'বাংলাদেশী').trim(),
      fatherNationalityEn: String(payload.fatherNationalityEn || 'Bangladeshi').trim(),
      birthPlaceBn: String(payload.birthPlaceBn || '').trim(),
      birthPlaceEn: String(payload.birthPlaceEn || '').trim(),
      permanentAddressBn: String(payload.permanentAddressBn || '').trim(),
      permanentAddressEn: String(payload.permanentAddressEn || '').trim(),
      dateInWords: String(payload.dateInWords || '').trim(),
      randomCode: String(payload.randomCode || '').trim(),
      pdfType: ['New', 'Duplicate', 'Corrected'].includes(payload.pdfType) ? payload.pdfType : 'New',
      qrCodeData: cleanBrn,
      barcodeData: cleanBrn
    };

    const apiResponse = await fetch('https://my.sheva247.site/api/hub/v1/birth-certificate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PDF_API_KEY,
        'Idempotency-Key': crypto.randomUUID()
      },
      body: JSON.stringify(requestBody)
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      return res.status(apiResponse.status).json({
        success: false,
        status: apiResponse.status,
        message: `PDF API Error (${apiResponse.status}): ${errText}`
      });
    }

    const arrayBuffer = await apiResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Birth_Certificate_${cleanBrn}.pdf"`);
    return res.status(200).send(buffer);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'PDF তৈরির সার্ভারে সমস্যা হয়েছে: ' + error.message
    });
  }
}
