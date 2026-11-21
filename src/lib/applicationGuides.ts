export type GuideCategory = 'Yojana' | 'Vacancy'
type Detail = { title: string; text: string }
type Guide = {
  id: string
  category: GuideCategory
  title: string
  intro: string
  host: string
  portal: string
  reference: string
  referenceLabel: string
  steps: Detail[]
  documents: Detail[]
  rules: Detail[]
}

export const applicationGuides: Guide[] = [
  {
    id: 'nsp',
    category: 'Yojana',
    title: 'National Scholarship Portal',
    intro: 'Student OTR se scholarship application aur institute verification tak.',
    host: 'scholarships.gov.in',
    portal: 'https://scholarships.gov.in/Students',
    reference: 'https://scholarships.gov.in/otrapplication/',
    referenceLabel: 'Official OTR instructions',
    steps: [
      {
        title: 'Apni scheme dekhein',
        text: 'Students mein Schemes on NSP kholein. Apne course, state aur academic year ki scheme guidelines aur closing dates padhein.',
      },
      {
        title: 'OTR banayein',
        text: 'Active mobile number se One Time Registration shuru karein. Portal ke Aadhaar/EID aur face-authentication steps poore karein. Mila hua 14-digit OTR sambhal kar rakhein.',
      },
      {
        title: 'Scholarship form bharein',
        text: 'Apply For Scholarship mein OTR se login karein. Sahi Fresh ya Renewal option, institute, course aur bank details bharein. Keval OTR banana scholarship application nahi hai.',
      },
      {
        title: 'Verify aur track karein',
        text: 'Details aur attachments check karke final submit karein. Application ID save karein aur institute verification ya correction ke liye dashboard dekhein.',
      },
    ],
    documents: [
      {
        title: 'Academic details',
        text: 'Marksheet se marks aur passing year bharein. Admission proof ya bonafide certificate ko usi naam ke field mein lagayein, agar scheme maange.',
      },
      {
        title: 'Family income aur category',
        text: 'Income field mein scheme ke relevant year ka income certificate lagayein. Category ya domicile proof ko alag field mein dein; ek document ko doosre ka substitute na maanein.',
      },
      {
        title: 'Photo, sign aur PDF',
        text: 'Har scheme mein photo/sign upload zaroori nahi hai. Field ke paas likha JPG/PDF format, dimensions aur maximum KB dekhein. Live authentication ko uploaded photo se replace na karein.',
      },
    ],
    rules: [
      {
        title: 'Age, course aur marks',
        text: 'NSP ki sab scholarships ke liye ek age limit ya marks cutoff nahi hai. Chuni hui scheme ka course level, minimum marks aur age rule hi lagu hoga.',
      },
      {
        title: 'Domicile aur institute',
        text: 'Permanent domicile aur padhai ki state alag ho sakti hain. Sahi domicile bharein aur check karein ki aapka course aur institute scheme mein eligible hai.',
      },
      {
        title: 'Income aur caste rules',
        text: 'Annual family income ceiling, category, certificate validity aur competent authority scheme ke mutabik hoti hai. Guideline mein diya saal aur format match karein.',
      },
    ],
  },
  {
    id: 'pm-kisan',
    category: 'Yojana',
    title: 'PM-KISAN Samman Nidhi',
    intro: 'Farmer registration, land records aur eKYC ki seedhi checklist.',
    host: 'pmkisan.gov.in',
    portal: 'https://pmkisan.gov.in/',
    reference: 'https://pmkisan.gov.in/Documents/RevisedFAQ.pdf',
    referenceLabel: 'Official scheme FAQs (PDF)',
    steps: [
      {
        title: 'Scheme rules padhein',
        text: 'PM-KISAN portal par Scheme Exclusion aur latest instructions dekhein. Pehle se registered hain to duplicate form banane ke bajay apna status check karein.',
      },
      {
        title: 'Farmer registration kholein',
        text: 'Farmers Corner mein New Farmer Registration chunein. Apni state aur portal par maangi gayi pehchan details bharein. State ka Farmer ID maanga jaye to uske official steps follow karein.',
      },
      {
        title: 'Zameen aur bank details milayein',
        text: 'Land details mein revenue record se survey/khasra number aur area bharein. Bank field mein apni passbook se account number aur IFSC milayein.',
      },
      {
        title: 'eKYC aur status',
        text: 'Registration reference save karein. Official portal/app ya authorized centre ke zariye eKYC poori karein. Farmers Corner se registration aur payment status dekhein.',
      },
    ],
    documents: [
      {
        title: 'Identity aur eKYC',
        text: 'Aadhaar mein darj naam aur portal ki details milni chahiye. Aadhaar number ya OTP is toolkit mein dene ki zaroorat nahi hai.',
      },
      {
        title: 'Land record field',
        text: 'State ke land record ki saaf copy taiyar rakhein. State aur village sahi chunein; jo document maanga hai wahi upload karein.',
      },
      {
        title: 'Upload size',
        text: 'Registration screen par maanga gaya format aur file-size limit follow karein. SSC photo/sign dimensions is yojana ke liye default rule nahi hain.',
      },
    ],
    rules: [
      {
        title: 'Landholding aur family',
        text: 'Eligibility eligible landholding farmer family ke record par nirbhar hai. Scheme mein family ka matlab pati, patni aur minor bachche hain. Ek hi family ke duplicate claims na karein.',
      },
      {
        title: 'Exclusion check',
        text: 'Institutional landholders aur exclusion list mein aane wali families eligible nahi hoti hain. Income-tax, occupation aur pension sambandhi poori list portal par padhein.',
      },
      {
        title: 'Age, education aur certificates',
        text: 'Yeh recruitment exam nahi hai: exam ki age/education limits yahan na lagayein. Basic eligibility ke liye caste ya income certificate ko land ownership proof ka badal na maanein.',
      },
    ],
  },
]

export function officialUrl(value: string) {
  const url = new URL(value)
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.port ||
    !/\.(gov|nic)\.in$/.test(url.hostname)
  )
    throw new Error(
      'Application guide links must point directly to an official HTTPS government portal.',
    )
  return url.href
}
