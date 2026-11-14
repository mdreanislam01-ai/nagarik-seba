import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const PDF_API_KEY = process.env.PDF_API_KEY || 'BHAPI-0745ff16433260b343d577c28b34ea7b05f217599ceb3f8e';

  try {
    const payload = req.body;

    // তারিখ DD/MM/YYYY হলে YYYY-MM-DD তে রূপান্তর করে নেওয়া (API রুল অনুযায়ী)
    const normalizeDate = (dt) => {
      if (!dt) return '';
      const s = String(dt).trim();
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
        const [d, m, y] = s.split('/');
        return `${y}-${m}-${d}`;
      }
      return s;
    };

    const requestBody = {
      birthRegNumber: String(payload.birthRegNumber || '').replace(/\D/g, ''),
      dateOfBirth: normalizeDate(payload.dateOfBirth),
      personNameBn: payload.personNameBn || '',
      personNameEn: payload.personNameEn || '',
      sex: payload.sex || 'Male',
      registrationOffice: payload.registrationOffice || '',
      officeLocation: payload.officeLocation || '',
      registrationDate: normalizeDate(payload.registrationDate),
      issuanceDate: normalizeDate(payload.issuanceDate),
      motherNameBn: payload.motherNameBn || '',
      motherNameEn: payload.motherNameEn || '',
      motherNationalityBn: payload.motherNationalityBn || 'বাংলাদেশী',
      motherNationalityEn: payload.motherNationalityEn || 'Bangladeshi',
      fatherNameBn: payload.fatherNameBn || '',
      fatherNameEn: payload.fatherNameEn || '',
      fatherNationalityBn: payload.fatherNationalityBn || 'বাংলাদেশী',
      fatherNationalityEn: payload.fatherNationalityEn || 'Bangladeshi',
      birthPlaceBn: payload.birthPlaceBn || '',
      birthPlaceEn: payload.birthPlaceEn || '',
      permanentAddressBn: payload.permanentAddressBn || '',
      permanentAddressEn: payload.permanentAddressEn || '',
      dateInWords: payload.dateInWords || '',
      randomCode: payload.randomCode || '',
      pdfType: payload.pdfType || 'New',
      qrCodeData: String(payload.birthRegNumber || '').replace(/\D/g, ''),
      barcodeData: String(payload.birthRegNumber || '').replace(/\D/g, '')
    };

    const idempotencyKey = crypto.randomUUID();

    const apiResponse = await fetch('https://my.sheva247.site/api/hub/v1/birth-certificate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PDF_API_KEY,
        'Idempotency-Key': idempotencyKey
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
    res.setHeader('Content-Disposition', `attachment; filename="Birth_Certificate_${requestBody.birthRegNumber}.pdf"`);
    return res.status(200).send(buffer);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'PDF তৈরির সার্ভারে সমস্যা হয়েছে: ' + error.message
    });
  }
}
