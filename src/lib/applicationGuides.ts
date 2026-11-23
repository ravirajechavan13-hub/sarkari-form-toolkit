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
  },  {
    id: 'digilocker',
    category: 'Yojana',
    title: 'DigiLocker',
    intro: 'Aadhaar, PAN, marksheet, DL aur RC jaise official digital documents fetch aur save karne ka portal.',
    host: 'digilocker.gov.in',
    portal: 'https://www.digilocker.gov.in/',
    reference: 'https://www.digilocker.gov.in/about.html',
    referenceLabel: 'About DigiLocker (Official)',
    steps: [
      {
        title: 'Sign up ya Login karein',
        text: 'Mobile number ya Aadhaar number aur OTP ki madad se apna DigiLocker account banayein ya login karein.',
      },
      {
        title: 'Issued Documents fetch karein',
        text: 'Search Documents mein jakar apna board, university, ya department chunein aur details daal kar document fetch karein.',
      },
      {
        title: 'Download ya Share karein',
        text: 'Issued Documents section se verified PDF download karein ya zaroorat padne par directly share karein.',
      },
    ],
    documents: [
      {
        title: 'Aadhaar & Mobile Number',
        text: 'Account verify karne ke liye Aadhaar se link active mobile number zaroori hai.',
      },
      {
        title: 'Document Details',
        text: 'Marksheet ya certificate fetch karne ke liye roll number, passing year, ya registration number chahiye.',
      },
    ],
    rules: [
      {
        title: 'OTP Verification',
        text: 'Aadhaar link karne ke liye Aadhaar-registered mobile par OTP aana zaroori hai.',
      },
      {
        title: 'Valid Digital Copy',
        text: 'DigiLocker se fetch kiye gaye documents IT Act ke tahat original ke barabar maane jaate hain.',
      },
    ],
  },
  {
    id: 'myscheme',
    category: 'Yojana',
    title: 'myScheme Portal',
    intro: 'Apni eligibility ke hisab se Central aur State government ki sahi yojana dhoondhne ka official platform.',
    host: 'myscheme.gov.in',
    portal: 'https://www.myscheme.gov.in/',
    reference: 'https://www.myscheme.gov.in/find-scheme',
    referenceLabel: 'Find Eligible Schemes',
    steps: [
      {
        title: 'Eligibility details bharein',
        text: 'Find Schemes par click karke apni age, gender, state, category aur income ki jankari chunein.',
      },
      {
        title: 'Schemes compare karein',
        text: 'Screen par dikhne wali eligible schemes ke benefits, documents aur rules padhein.',
      },
      {
        title: 'Official portal par apply karein',
        text: 'Pasand ki scheme ke andar diye gaye official application link par jakar form bharein.',
      },
    ],
    documents: [
      {
        title: 'Basic Profile Info',
        text: 'Eligibility check karne ke liye kisi document upload ki zaroorat nahi hoti, sirf basic details chahiye.',
      },
      {
        title: 'Scheme-Specific Docs',
        text: 'Apply karte waqt Aadhaar, income, caste ya domicile certificate ki zaroorat scheme ke hisab se padti hai.',
      },
    ],
    rules: [
      {
        title: 'Discovery Platform',
        text: 'myScheme sirf sahi yojana aur documents batata hai; actual form sambandhit department ke portal par bhara jata hai.',
      },
    ],
  },
  {
    id: 'myaadhaar',
    category: 'Yojana',
    title: 'myAadhaar (UIDAI)',
    intro: 'e-Aadhaar download, PVC card order, address update aur Aadhaar status check karne ka official portal.',
    host: 'myaadhaar.uidai.gov.in',
    portal: 'https://myaadhaar.uidai.gov.in/',
    reference: 'https://uidai.gov.in/',
    referenceLabel: 'UIDAI Official Website',
    steps: [
      {
        title: 'Aadhaar & OTP se login karein',
        text: '12-digit Aadhaar number aur registered mobile par aaya OTP daal kar dashboard kholein.',
      },
      {
        title: 'Service chunein',
        text: 'Download Aadhaar, Order PVC Card, ya Address Update mein se apni zaroorat ki service select karein.',
      },
      {
        title: 'Receipt / PDF save karein',
        text: 'Kaam pura hone ke baad SRN number ya password-protected e-Aadhaar PDF save kar lein.',
      },
    ],
    documents: [
      {
        title: 'Valid Address Proof',
        text: 'Address update ke liye bijli bill, bank passbook, ration card ya passport jaise valid proof lagte hain.',
      },
      {
        title: 'PDF Password Rule',
        text: 'Downloaded e-Aadhaar kholne ke liye naam ke pehle 4 capital letters aur birth year (jaise RAVI1997) daalna hota hai.',
      },
    ],
    rules: [
      {
        title: 'Registered Mobile Zaroori',
        text: 'Online login aur update ke liye mobile number Aadhaar se link hona zaroori hai; varna Aadhaar Seva Kendra jana padega.',
      },
    ],
  },
  {
    id: 'parivahan',
    category: 'Yojana',
    title: 'Parivahan Sewa',
    intro: 'Driving Licence (LL/DL), Vehicle RC, eChallan aur RTO se judi online services ka portal.',
    host: 'parivahan.gov.in',
    portal: 'https://parivahan.gov.in/',
    reference: 'https://parivahan.gov.in/parivahan/',
    referenceLabel: 'Parivahan Services',
    steps: [
      {
        title: 'Online Services chunein',
        text: 'Driving Licence Related Services (Sarathi) ya Vehicle Related Services (Vahan) par click karein.',
      },
      {
        title: 'Apna State select karein',
        text: 'List mein se apna State chunein aur Learner/Driving Licence, RC ya eChallan option kholein.',
      },
      {
        title: 'Form, Fee aur Slot book karein',
        text: 'Details bhar kar documents upload karein, online fee pay karein aur RTO appointment slot book karein.',
      },
    ],
    documents: [
      {
        title: 'Age & Address Proof',
        text: 'Licence ke liye Aadhaar, PAN, birth certificate ya 10th marksheet aur photo/signature lagte hain.',
      },
      {
        title: 'Vehicle Papers',
        text: 'Vehicle services ke liye RC number, chassis number ke last 5 digits aur insurance/PUC details chahiye.',
      },
    ],
    rules: [
      {
        title: 'State-Specific Rules',
        text: 'Kuch services state RTO ke hisab se contactless (Aadhaar OTP) hoti hain, aur kuch ke liye RTO visit zaroori hai.',
      },
    ],
  },
  {
    id: 'passport',
    category: 'Yojana',
    title: 'Passport Seva',
    intro: 'Naya passport, renewal (re-issue), Tatkaal passport aur appointment booking ka official portal.',
    host: 'passportindia.gov.in',
    portal: 'https://www.passportindia.gov.in/',
    reference: 'https://www.passportindia.gov.in/AppOnlineProject/online/faqApplicationForm',
    referenceLabel: 'Passport Application FAQs',
    steps: [
      {
        title: 'Register & Login karein',
        text: 'New User Registration karke apna Passport Office chunein aur account se login karein.',
      },
      {
        title: 'Application form bharein',
        text: 'Fresh ya Re-issue Passport select karke apni personal, family aur address details dhyan se bharein.',
      },
      {
        title: 'Fee pay aur PSK appointment',
        text: 'Online fee jama karein, Passport Seva Kendra (PSK) ka slot book karein aur original documents lekar jayein.',
      },
    ],
    documents: [
      {
        title: 'Identity & Address Proof',
        text: 'Aadhaar card, PAN, Voter ID, ya bank passbook mein se valid documents original aur photocopy ke saath rakhein.',
      },
      {
        title: 'Non-ECR Proof',
        text: '10th pass marksheet ya higher qualification certificate Non-ECR category ke liye zaroori hota hai.',
      },
    ],
    rules: [
      {
        title: 'Police Verification',
        text: 'Application ke baad local police station se verification hota hai; details ekdum sahi bharna zaroori hai.',
      },
    ],
  },
  {
    id: 'incometax',
    category: 'Yojana',
    title: 'Income Tax e-Filing',
    intro: 'ITR file karne, PAN-Aadhaar link status check karne aur tax payment ke liye official portal.',
    host: 'incometax.gov.in',
    portal: 'https://www.incometax.gov.in/',
    reference: 'https://www.incometax.gov.in/iec/foportal/',
    referenceLabel: 'e-Filing Portal Home',
    steps: [
      {
        title: 'PAN se Login karein',
        text: 'Apne PAN number aur password (ya Net Banking / Aadhaar OTP) se e-Filing portal par login karein.',
      },
      {
        title: 'ITR ya Service chunein',
        text: 'e-File menu se Income Tax Return (ITR) bharein ya Quick Links se PAN-Aadhaar status check karein.',
      },
      {
        title: 'e-Verify zaroor karein',
        text: 'Return submit karne ke baad Aadhaar OTP ya EVC se 30 din ke andar e-Verify karna zaroori hai.',
      },
    ],
    documents: [
      {
        title: 'PAN, Form 16 & AIS',
        text: 'ITR ke liye PAN, Aadhaar, bank statement, Form 16 (salary ke liye) aur portal par AIS/26AS check karein.',
      },
    ],
    rules: [
      {
        title: 'PAN-Aadhaar Linking',
        text: 'PAN aur Aadhaar link na hone par PAN inoperative ho sakta hai aur refund ya services ruk sakti hain.',
      },
    ],
  },
  {
    id: 'epfo',
    category: 'Yojana',
    title: 'EPFO Member Portal',
    intro: 'PF balance check, UAN activation, KYC update, aur PF withdrawal/transfer claim karne ka portal.',
    host: 'epfo.gov.in',
    portal: 'https://www.epfo.gov.in/',
    reference: 'https://www.epfo.gov.in/site_en/For_Employees.php',
    referenceLabel: 'EPFO Employee Services',
    steps: [
      {
        title: 'UAN Activate karein',
        text: 'Member UAN portal par jakar UAN, Aadhaar, name aur date of birth daal kar apna UAN activate karein.',
      },
      {
        title: 'KYC Update karein',
        text: 'Manage > KYC mein jakar apna Aadhaar, PAN aur bank account details link aur approve karwayein.',
      },
      {
        title: 'Passbook ya Claim karein',
        text: 'Balance dekhne ke liye Passbook kholein, aur paise nikalne ke liye Online Services > Claim form bharein.',
      },
    ],
    documents: [
      {
        title: 'UAN & Bank Details',
        text: 'Active UAN, Aadhaar, PAN aur bank passbook/cancelled cheque ki clear copy zaroori hai.',
      },
    ],
    rules: [
      {
        title: 'KYC & Name Match',
        text: 'PF withdrawal ke liye UAN, Aadhaar aur bank account mein naam aur date of birth bilkul match honi chahiye.',
      },
    ],
  },
  {
    id: 'umang',
    category: 'Yojana',
    title: 'UMANG Portal',
    intro: 'Central aur State government ki saikdon services (EPFO, Ration, DigiLocker, Gas) ek hi jagah.',
    host: 'web.umang.gov.in',
    portal: 'https://web.umang.gov.in/',
    reference: 'https://web.umang.gov.in/landing/dashboard',
    referenceLabel: 'UMANG Services Dashboard',
    steps: [
      {
        title: 'Mobile OTP se login karein',
        text: 'Apna mobile number daal kar OTP ya MPIN se UMANG web portal ya app mein login karein.',
      },
      {
        title: 'Department search karein',
        text: 'Search bar mein EPFO, AICTE, Ration Card, ya State service ka naam likh kar kholein.',
      },
      {
        title: 'Service use karein',
        text: 'Zaroori details daal kar seedhe wahin se certificate download, status check ya apply karein.',
      },
    ],
    documents: [
      {
        title: 'Service-Based Info',
        text: 'Har department ki service ke hisab se UAN, Aadhaar, ration number ya application ID lagti hai.',
      },
    ],
    rules: [
      {
        title: 'Single Window Access',
        text: 'UMANG alag-alag sarkari portals ko ek jagah jodne ka madhyam hai; rules har department ke apne hote hain.',
      },
    ],
  },
  {
    id: 'voters',
    category: 'Yojana',
    title: "Voters' Services Portal",
    intro: 'Naya Voter ID (Form 6), naam/address correction (Form 8) aur e-EPIC download karne ka portal.',
    host: 'voters.eci.gov.in',
    portal: 'https://voters.eci.gov.in/',
    reference: 'https://voters.eci.gov.in/',
    referenceLabel: 'Election Commission Portal',
    steps: [
      {
        title: 'Account banayein aur login karein',
        text: 'Mobile number aur OTP se Sign Up karke Voters Services Portal par login karein.',
      },
      {
        title: 'Sahi Form chunein',
        text: 'Naye Voter ID ke liye Form 6 aur kisi bhi correction ya shifting ke liye Form 8 bharein.',
      },
      {
        title: 'Track & e-EPIC Download',
        text: 'Reference ID se status track karein aur card banne ke baad e-EPIC PDF download kar lein.',
      },
    ],
    documents: [
      {
        title: 'Photo, Age & Address Proof',
        text: 'Passport size photo, birth proof (Aadhaar/10th marksheet) aur address proof (bijli bill/bank passbook/Aadhaar) lagta hai.',
      },
    ],
    rules: [
      {
        title: 'Age & Mobile Rule',
        text: '18 saal ya usse upar ke Indian citizens apply kar sakte hain; e-EPIC download ke liye mobile number link hona zaroori hai.',
      },
    ],
  },
  {
    id: 'pmjay',
    category: 'Yojana',
    title: 'Ayushman Bharat (PM-JAY)',
    intro: '₹5 Lakh tak ke muft ilaj ke liye Ayushman Card eligibility check aur hospital search portal.',
    host: 'pmjay.gov.in',
    portal: 'https://www.pmjay.gov.in/',
    reference: 'https://www.pmjay.gov.in/about/pmjay',
    referenceLabel: 'About Ayushman Bharat',
    steps: [
      {
        title: 'Eligibility check karein',
        text: 'Am I Eligible option par jakar apne mobile number, ration card ya Aadhaar se family list mein naam dekhein.',
      },
      {
        title: 'e-KYC complete karein',
        text: 'Naam list mein hone par Aadhaar OTP ya nearest CSC / hospital counter se e-KYC karwayein.',
      },
      {
        title: 'Card download & Hospital search',
        text: 'Approval ke baad Ayushman Card download karein aur list mein empanelled hospital dhoondhein.',
      },
    ],
    documents: [
      {
        title: 'Ration Card & Aadhaar',
        text: 'Family verification ke liye Ration Card aur e-KYC ke liye Aadhaar card zaroori hai.',
      },
    ],
    rules: [
      {
        title: 'Empanelled Hospitals Only',
        text: 'Cashless ilaj sirf PM-JAY se jude hue sarkari aur private empanelled hospitals mein hi milta hai.',
      },
    ],
  },
  {
    id: 'ladki-bahin',
    category: 'Yojana',
    title: 'Mukhyamantri Majhi Ladki Bahin Yojana',
    intro: 'Maharashtra ki patra mahilaon ko har mahine ₹1,500 ki aarthik sahayata dene wali official yojana.',
    host: 'ladakibahin.maharashtra.gov.in',
    portal: 'https://ladakibahin.maharashtra.gov.in/',
    reference: 'https://ladakibahin.maharashtra.gov.in/',
    referenceLabel: 'Ladki Bahin Official Portal',
    steps: [
      {
        title: 'Applicant Login banayein',
        text: 'Portal par Applicant Login par click karke apna mobile number, naam aur password daal kar account banayein.',
      },
      {
        title: 'Form aur Documents upload karein',
        text: 'Login ke baad apni personal, bank aur Aadhaar details bharein aur zaroori documents scan karke upload karein.',
      },
      {
        title: 'e-KYC aur Status check',
        text: 'Form submit karne ke baad Aadhaar e-KYC aur application status portal par check karte rahein.',
      },
    ],
    documents: [
      {
        title: 'Aadhaar & Bank Passbook',
        text: 'Aadhaar card aur Aadhaar se DBT-linked active bank account zaroori hai.',
      },
      {
        title: 'Residence & Income Proof',
        text: 'Maharashtra domicile (ya 15 saal purana ration/voter/birth proof), income proof (ya yellow/orange ration card) aur photo.',
      },
    ],
    rules: [
      {
        title: 'Age & Income Limit',
        text: 'Maharashtra ki 21 se 65 saal ki mahila, jinke parivar ki kul salana aay ₹2.5 Lakh tak ho, wahi patra hain.',
      },
      {
        title: 'Exclusions',
        text: 'Parivar mein koi Income Tax payer, sarkari naukri/pension wala, ya 4-wheeler (tractor chhodkar) nahi hona chahiye.',
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
