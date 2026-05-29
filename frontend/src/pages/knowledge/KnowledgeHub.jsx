import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Scale, FileText, CheckSquare,
  HelpCircle, Video, ChevronRight, Search,
  Download, Printer, Info, ShieldAlert,
  ArrowLeft, ExternalLink, Lightbulb, Gavel,
  ShieldCheck, X, FileSignature, Landmark,
  GanttChart, AlertTriangle, UserPlus, HeartPulse,
  Activity, Briefcase, FileSearch, ShieldCheck as ShieldIcon,
  Star, Quote, User
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function KnowledgeHub() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('rights');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    if (tabParam && ['rights', 'claims', 'documents', 'templates', 'checklist', 'reviews', 'faq'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const guideData = {
    'MACT Jurisdiction': {
      title: 'MACT Jurisdiction',
      icon: <Gavel className="w-5 h-5" />,
      fullDesc: 'The Motor Accident Claims Tribunal (MACT) deals with claims for compensation in respect of accidents involving the death of, or bodily injury to, persons arising out of the use of motor vehicles, or damage to any property of a third party so arising, or both.',
      provisions: [
        { title: 'Statutory Right to Claim', desc: 'Under Section 166 of the Motor Vehicles Act, 1988, any person who has sustained injury or the legal representatives of the deceased can file a claim.' },
        { title: 'No Fault Liability', desc: 'Section 140 provides for fixed compensation in case of death or permanent disablement even if no fault of the driver is proven.' },
        { title: 'Unlimited Compensation', desc: 'Unlike many other insurances, MACT awards are based on the loss of dependency and are not capped by a fixed sum.' }
      ],
      docs: ['Original FIR Copy', 'Medical Reports & Bills', 'Income Proof of Victim', 'Post-Mortem Report (if applicable)', 'Insurance Policy Copy']
    },
    'Insurer Compliance': {
      title: 'Insurer Compliance',
      icon: <ShieldAlert className="w-5 h-5" />,
      fullDesc: 'Insurance companies are governed by strict IRDAI (Insurance Regulatory and Development Authority of India) guidelines to ensure fair and timely settlement of claims without undue administrative harassment.',
      provisions: [
        { title: 'Surveyor Timelines', desc: 'A surveyor must be appointed within 72 hours of the claim report and must submit the report within 30 days.' },
        { title: 'Interest on Delays', desc: 'If the company delays settlement beyond 30 days of receiving all documents, they are liable to pay interest at 2% above the bank rate.' },
        { title: 'Reasoned Rejection', desc: 'Any claim rejection must be communicated in writing with specific reasons citing the policy clauses violated.' }
      ],
      docs: ['Claim Form (Form C)', 'Surveyor Appointment Letter', 'Discharge Voucher', 'KYC Documents', 'Bank Details (Cancelled Cheque)'],
      pdfUrl: '/insurer-compliance.pdf'
    },
    'Consumer Protection': {
      title: 'Consumer Protection',
      icon: <Lightbulb className="w-5 h-5" />,
      fullDesc: 'The Consumer Protection Act ensures that policyholders are treated as consumers with rights to quality service. This covers disputes regarding repair quality, part replacement vs. repair, and fair depreciation calculations.',
      provisions: [
        { title: 'Part Replacement Rights', desc: 'Insurers cannot force the use of non-genuine or second-hand parts if the policy covers "New for Old" or Zero Depreciation.' },
        { title: 'Fair Depreciation', desc: 'Depreciation rates are standardized (e.g., 50% for rubber/plastic, 30% for fiber) and cannot be arbitrarily increased.' },
        { title: 'Grievance Redressal', desc: 'Every insurer must have an Internal Grievance Redressal Officer (GRO) before a matter goes to the Ombudsman.' }
      ],
      docs: ['Repair Estimate from Authorized Center', 'Previous Policy History', 'Communication logs with Insurer', 'Consumer Court Affidavit', 'Part-wise Repair Invoice'],
      pdfUrl: '/consumer-protection.pdf'
    },
    'Road Safety Statutes': {
      title: 'Road Safety Statutes',
      icon: <ShieldCheck className="w-5 h-5" />,
      fullDesc: 'Statutory provisions designed to protect road users and encourage emergency assistance. This includes the Solatium Fund for Hit-and-Run cases and the Good Samaritan Law.',
      provisions: [
        { title: 'Hit-and-Run Fund', desc: 'The Solatium Fund provides fixed compensation of ₹2,00,000 for death and ₹50,000 for grievous hurt in hit-and-run cases.' },
        { title: 'Good Samaritan Law', desc: 'Bystanders who help victims are legally protected from civil or criminal liability and cannot be forced to disclose identity.' },
        { title: 'Cashless Medical Care', desc: 'The Golden Hour policy mandates that hospitals must provide stabilization treatment without upfront payment in trauma cases.' }
      ],
      docs: ['Police Report', 'Hospital Emergency Record', 'Good Samaritan ID (Optional)', 'Solatium Fund Application', 'FIR Registration Receipt'],
      pdfUrl: '/road-safety-statutes.pdf'
    },
    'Lok Adalat Settlements': {
      title: 'Lok Adalat Settlements',
      icon: <Scale className="w-5 h-5" />,
      fullDesc: 'Alternative dispute resolution for fast-track settlement of accident claims without court litigation.',
      provisions: [
        { title: 'Speedy Resolution', desc: 'Settlements are reached in a single day through mutual mediation.' },
        { title: 'Finality of Award', desc: 'Awards passed by Lok Adalat are deemed to be a decree of a civil court and are non-appealable.' }
      ],
      docs: ['Mediation Request', 'Proof of Loss', 'Mutual Consent Form']
    },
    'Legal Aid Provisions': {
      title: 'Legal Aid Provisions',
      icon: <Landmark className="w-5 h-5" />,
      fullDesc: 'Free legal services provided to underprivileged victims and their families under the legal aid framework.',
      provisions: [
        { title: 'Eligibility', desc: 'Persons with annual income below specified limits or belonging to vulnerable categories are eligible.' },
        { title: 'Pro-Bono Counsel', desc: 'The government provides qualified advocates to represent victims in MACT and Consumer courts at zero cost.' }
      ],
      docs: ['Income Certificate', 'Legal Aid Application Form']
    },
    'Ombudsman Rights': {
      title: 'Ombudsman Rights',
      icon: <ShieldIcon className="w-5 h-5" />,
      fullDesc: 'The Insurance Ombudsman is an independent body for resolving grievances between policyholders and insurers without legal fees.',
      provisions: [
        { title: 'Complaint Scope', desc: 'Covers delays in settlement, partial settlement, and premium disputes.' },
        { title: 'Award Binding', desc: 'If the policyholder accepts the Ombudsman award, the insurer is legally bound to comply within 30 days.' }
      ],
      docs: ['GRO Rejection Letter', 'Ombudsman Annexure', 'Policy Schedule']
    },
    'Police Accountability': {
      title: 'Police Accountability',
      icon: <Scale className="w-5 h-5" />,
      fullDesc: 'Statutory duties of police officers following an accident to ensure victims can access justice and insurance.',
      provisions: [
        { title: 'Zero FIR Rights', desc: 'Victims can register an FIR at any station; the case is later transferred to the relevant jurisdiction.' },
        { title: 'Accident Information Report (AIR)', desc: 'Police are mandated to submit the AIR to the MACT within 30 days of the incident.' }
      ],
      docs: ['Copy of FIR', 'Panchnama Report', 'Site Map Copy']
    },
    'Third-Party Claim': {
      title: 'Third-Party Claim',
      icon: <Scale className="w-5 h-5" />,
      fullDesc: 'A claim filed when your vehicle causes damage, injury, or death to another person or their property, or when you are the victim of another vehicle\'s accident. Third-Party Liability cover is mandatory in India under the Motor Vehicles Act.',
      provisions: [
        { title: 'Mandatory Insurance', desc: 'Section 146 of the Motor Vehicles Act, 1988 makes Third-Party insurance compulsory for all vehicles.' },
        { title: 'No Compensation Limit', desc: 'Compensation for bodily injury or death of a third party is unlimited and decided by the MACT.' },
        { title: 'Property Damage Cap', desc: 'Third-party property damage coverage is capped at ₹7.5 Lakhs by default.' }
      ],
      docs: ['FIR Copy', 'Vehicle Registration Certificate (RC)', 'Driving License (DL)', 'Insurance Policy Copy', 'MACT Claim Petition Forms Form 53/54']
    },
    'Own Damage Claim': {
      title: 'Own Damage Claim',
      icon: <ShieldCheck className="w-5 h-5" />,
      fullDesc: 'A claim filed to seek compensation for damages sustained by your own insured vehicle due to accidents, fire, natural disasters, or vandalism. This is covered under a Comprehensive or Standalone Own Damage Policy.',
      provisions: [
        { title: 'Surveyor Inspection', desc: 'An IRDAI-approved surveyor must inspect the vehicle and submit a report before repairs begin.' },
        { title: 'Depreciation Rules', desc: 'Standard depreciation applies to parts (e.g., 50% for plastics/rubber, 30% for fiber) unless a Zero Depreciation add-on is active.' },
        { title: 'Insured Declared Value (IDV)', desc: 'Payout is capped at the IDV of the vehicle minus the compulsory deductible.' }
      ],
      docs: ['Completed Claim Form', 'Copy of FIR (for major accidents or third-party involvement)', 'Original Estimate from Repair Garage', 'Driving License and RC Copy', 'Payment Receipt/Invoice after repair']
    },
    'Theft Recovery': {
      title: 'Theft Recovery',
      icon: <GanttChart className="w-5 h-5" />,
      fullDesc: 'The legal and insurance claim process to receive compensation if your vehicle is stolen and cannot be recovered by the police.',
      provisions: [
        { title: 'Immediate Police Report', desc: 'An FIR for theft must be lodged immediately under Section 379 IPC at the nearest police station.' },
        { title: 'Non-Traceable Certificate', desc: 'The police must issue a final report/Non-Traceable Certificate if the vehicle is not found within a reasonable period (usually 30 to 90 days).' },
        { title: 'Transfer of Ownership', desc: 'To claim the IDV, the owner must transfer the registration of the stolen vehicle and hand over keys to the insurer.' }
      ],
      docs: ['Original FIR for Theft', 'Non-Traceable Certificate from Police', 'Forms 28, 29, and 30 for transfer of vehicle ownership', 'Both original keys of the vehicle', 'Original RC and Insurance Policy document']
    },
    'Total Loss Logic': {
      title: 'Total Loss Logic',
      icon: <Landmark className="w-5 h-5" />,
      fullDesc: 'A vehicle is declared a constructive total loss (CTL) when the estimated cost of repairs exceeds a certain percentage of its Insured Declared Value (IDV).',
      provisions: [
        { title: 'The 75% Threshold', desc: 'Under standard IRDAI guidelines, if the repair cost exceeds 75% of the vehicle\'s IDV, it is classified as Constructive Total Loss.' },
        { title: 'IDV Settlement', desc: 'The insurer pays the full IDV amount to the policyholder, minus compulsory deductibles.' },
        { title: 'Salvage Retention', desc: 'The insurer usually takes possession of the vehicle wreckage (salvage) or deducts the salvage value if the owner retains it.' }
      ],
      docs: ['Detailed repair estimate from authorized garage', 'Surveyor\'s Constructive Total Loss report', 'Original RC Book for cancellation/transfer', 'Keys and original policy documents', 'Salvage transfer agreement']
    },
    'NCB Retention': {
      title: 'NCB Retention',
      icon: <Activity className="w-5 h-5" />,
      fullDesc: 'No Claim Bonus (NCB) is a reward discount given to policyholders on their own-damage premium for not making any claims in the preceding policy years.',
      provisions: [
        { title: 'NCB Transferability', desc: 'NCB belongs to the vehicle owner, not the vehicle. It can be transferred to a new vehicle purchased by the same owner.' },
        { title: 'Grace Period', desc: 'An NCB is preserved and can be rolled over if the policy is renewed within 90 days of its expiry date.' },
        { title: 'NCB Protect Add-On', desc: 'An optional add-on that protects your accumulated discount even if you make a claim during the year (usually up to 1-2 claims).' }
      ],
      docs: ['Existing Policy Schedule showing NCB percentage', 'NCB Transfer Certificate from the previous insurer', 'Proof of sale of old vehicle (Form 29 & 30)', 'New vehicle booking receipt']
    },
    'Cashless Settlement': {
      title: 'Cashless Settlement',
      icon: <Landmark className="w-5 h-5" />,
      fullDesc: 'A convenient claims method where the insurer directly settles the approved repair bills with a network/authorized garage, minimizing the policyholder\'s out-of-pocket expenses.',
      provisions: [
        { title: 'Network Garage Requirement', desc: 'Cashless repair is only available at garages pre-approved and networked with your specific insurance company.' },
        { title: 'Pre-Authorization', desc: 'The garage must send an estimate to the insurer and receive a pre-auth approval letter before commencing work.' },
        { title: 'Customer Share', desc: 'The customer is still responsible for compulsory deductibles, voluntary deductibles, depreciation on parts (unless zero-dep), and consumables.' }
      ],
      docs: ['Pre-Authorization Request Form', 'Estimate of repair from network garage', 'Copy of Driving License and RC', 'Signed Claim Form', 'Copy of Policy Document']
    },
    'Re-registration': {
      title: 'Re-registration',
      icon: <GanttChart className="w-5 h-5" />,
      fullDesc: 'The legal process required to update or renew a vehicle\'s registration certificate (RC) at the RTO (Regional Transport Office) after major modifications or relocation.',
      provisions: [
        { title: 'Modification Approvals', desc: 'Any change in engine or chassis requires prior approval and endorsement from the RTO under Section 52 of the MV Act.' },
        { title: 'State Relocation NOC', desc: 'If moving a vehicle to another state for more than 12 months, a No Objection Certificate (NOC) must be obtained from the parent RTO.' },
        { title: 'Road Tax Refund', desc: 'Upon paying road tax in the new state, the owner can apply for a pro-rata road tax refund from the original state.' }
      ],
      docs: ['Form 28 (Application for NOC)', 'Form 27 (Application for new registration mark)', 'Original RC and Address Proof', 'Pollution Under Control (PUC) certificate', 'Chassis print copy']
    },
    'Claim Re-opening': {
      title: 'Claim Re-opening',
      icon: <FileSignature className="w-5 h-5" />,
      fullDesc: 'The process of revisiting or re-examining an insurance claim that has already been closed, settled, or rejected, usually due to new evidence or administrative errors.',
      provisions: [
        { title: 'Grounds for Re-opening', desc: 'Allowed if new medical diagnoses emerge, additional vehicle defects are discovered later, or fraud is suspected.' },
        { title: 'Limitation Period', desc: 'Under consumer law, disputes or appeals against settlements must generally be filed within 2 years of the cause of action.' },
        { title: 'Arbitration Clause', desc: 'Most policies contain an arbitration clause to resolve disputes regarding the quantum of settlement without going to court.' }
      ],
      docs: ['Original Claim closure or rejection letter', 'New supporting evidence (detailed invoice, supplementary estimate, medical reports)', 'Written request to the Grievance Redressal Officer', 'Original Policy Document']
    },
    'Motor Vehicles Act 1988': {
      title: 'Motor Vehicles Act 1988',
      icon: <Landmark className="w-5 h-5" />,
      fullDesc: 'The primary central legislation governing all road transport vehicles, licensing, traffic regulations, and liability insurance in India.',
      provisions: [
        { title: 'Mandatory Third-Party Cover', desc: 'Section 146 mandates that no person shall use a motor vehicle in a public place without a valid third-party insurance policy.' },
        { title: 'MACT Petitions', desc: 'Section 166 outlines the process for victims or their legal heirs to claim unlimited compensation for injury or death.' },
        { title: 'Zero Fault Compensation', desc: 'Section 140/164 provides for interim relief under "no-fault liability" for quick financial support.' }
      ],
      docs: ['Official Act PDF', 'RTO Gazette Notification', 'Bare Act Reference Manual'],
      pdfUrl: '/mv-act-1988.pdf'
    },
    'Regulatory Protection': {
      title: 'Regulatory Protection',
      icon: <ShieldAlert className="w-5 h-5" />,
      fullDesc: 'Guidelines issued by the Insurance Regulatory and Development Authority of India (IRDAI) to protect policyholder rights against unfair claim rejections.',
      provisions: [
        { title: 'Claim Settlement Timeline', desc: 'Insurers must settle or reject a claim within 30 days of receiving all necessary documents.' },
        { title: 'GRO Escalation', desc: 'Every insurer must have a dedicated Grievance Redressal Officer to handle customer appeals.' },
        { title: 'Interest on Delays', desc: 'Insurers must pay bank-rate plus 2% interest for delayed payouts beyond statutory timelines.' }
      ],
      docs: ['IRDAI Protection Guidelines', 'Grievance Form Annexure', 'Circular on Delayed Claims'],
      pdfUrl: '/irdai-protection.pdf'
    },
    'Road Safety Gazette 2024': {
      title: 'Road Safety Gazette 2024',
      icon: <Gavel className="w-5 h-5" />,
      fullDesc: 'Official Government of India Gazette notification introducing stricter rules for speed limits, safety equipment, and accident management.',
      provisions: [
        { title: 'Electronic Monitoring', desc: 'Mandatory speed cameras and telemetry monitoring on national highways.' },
        { title: 'Enhanced Penalties', desc: 'Stricter fines for driving without a license, speeding, and reckless driving.' }
      ],
      docs: ['Gazette Copy 2024', 'Highway Safety Handout'],
      pdfUrl: '/road-safety-gazette.pdf'
    },
    'MACT Procedure Rules': {
      title: 'MACT Procedure Rules',
      icon: <FileSignature className="w-5 h-5" />,
      fullDesc: 'State-specific judicial rules dictating how motor accident claims must be filed, verified, and adjudicated in Tribunals.',
      provisions: [
        { title: 'Detailed Accident Report (DAR)', desc: 'Police must submit a DAR within 90 days to the MACT for faster processing.' },
        { title: 'Lok Adalat Referral', desc: 'Tribunals can refer disputes to Lok Adalat for quick, compromise-based settlements.' }
      ],
      docs: ['Tribunal Claims Form', 'DAR Filing Checklist', 'Lok Adalat Consent Letter'],
      pdfUrl: '/mact-rules.pdf'
    },
    'National Road Safety Policy': {
      title: 'National Road Safety Policy',
      icon: <ShieldCheck className="w-5 h-5" />,
      fullDesc: 'A comprehensive national framework focused on reducing road fatalities through better engineering, education, enforcement, and emergency care.',
      provisions: [
        { title: 'The 4 Es of Safety', desc: 'Refers to Engineering of roads/vehicles, Enforcement of rules, Education of public, and Emergency response.' },
        { title: 'Golden Hour Support', desc: 'Ensures free stabilization treatment within the first hour of trauma.' }
      ],
      docs: ['National Policy Document', 'State Safety Guidelines'],
      pdfUrl: '/road-safety-policy.pdf'
    },
    'Motor Vehicle Rules 1989': {
      title: 'Motor Vehicle Rules 1989',
      icon: <Scale className="w-5 h-5" />,
      fullDesc: 'Central Motor Vehicles Rules (CMVR) detailing registration, fitness certificates, pollution control, and driver licensing procedures.',
      provisions: [
        { title: 'Registration & Fitness', desc: 'Mandatory fitness certification for commercial vehicles and 15-year renewal for private vehicles.' },
        { title: 'PUC Certification', desc: 'Compulsory periodic emission checking for all operational motor vehicles.' }
      ],
      docs: ['CMVR 1989 Guidebook', 'PUC Standards Sheet'],
      pdfUrl: '/mv-rules-1989.pdf'
    },
    'Solatium Fund Scheme': {
      title: 'Solatium Fund Scheme',
      icon: <Activity className="w-5 h-5" />,
      fullDesc: 'Government scheme providing statutory compensation for victims of hit-and-run motor accidents where the vehicle cannot be identified.',
      provisions: [
        { title: 'Death Compensation', desc: 'Fixed solatium compensation of ₹2,00,000 paid to the legal heirs of the deceased.' },
        { title: 'Grievous Hurt Compensation', desc: 'Fixed compensation of ₹50,000 paid to victims suffering major bodily injuries.' }
      ],
      docs: ['Form A (Claim application)', 'Police Untraceable Report', 'Medical Disability Certificate'],
      pdfUrl: '/solatium-scheme.pdf'
    },
    'Standard Insurance Policy': {
      title: 'Standard Insurance Policy',
      icon: <FileText className="w-5 h-5" />,
      fullDesc: 'The baseline template of a Comprehensive Motor Insurance Policy approved by the IRDAI, outlining all standard terms, conditions, and exclusions.',
      provisions: [
        { title: 'Own Damage Coverage', desc: 'Covers physical damage to the insured vehicle due to collisions, natural disasters, or theft.' },
        { title: 'Exclusions Clause', desc: 'Excludes damage caused by drunk driving, driving without a license, or wear and tear.' }
      ],
      docs: ['Policy Wordings Document', 'Deductibles Schedule'],
      pdfUrl: '/standard-policy.pdf'
    },
    'Claim Rejection Appeal': {
      title: 'Claim Rejection Appeal',
      icon: <FileText className="w-5 h-5" />,
      fullDesc: 'A drafted template to file a formal appeal with the insurance company\'s Grievance Redressal Officer against a claim rejection.',
      provisions: [
        { title: 'Grounds of Appeal', desc: 'Clearly dispute surveyor findings using concrete invoices and technical verification.' },
        { title: 'Statutory Timelines', desc: 'Must be submitted within 30 days of receiving the formal rejection letter.' }
      ],
      docs: ['Rejection Appeal Draft', 'Surveyor Report Copy', 'Supporting Bills'],
      pdfUrl: '/claim-appeal-letter.pdf'
    },
    'Legal Notice to Insurer': {
      title: 'Legal Notice to Insurer',
      icon: <Gavel className="w-5 h-5" />,
      fullDesc: 'A lawyer-verified legal notice template to warn the insurance company before initiating consumer court litigation.',
      provisions: [
        { title: 'Notice Period', desc: 'Gives the insurer 15 to 30 days to resolve the claim before a suit is filed.' },
        { title: 'Damages Claimed', desc: 'Demands payout of claim plus interest, mental harassment damages, and litigation expenses.' }
      ],
      docs: ['Notice Draft (Word)', 'Delivery Proof Template'],
      pdfUrl: '/legal-notice-insurer.pdf'
    },
    'Consumer Complaint Draft': {
      title: 'Consumer Complaint Draft',
      icon: <FileSignature className="w-5 h-5" />,
      fullDesc: 'A formal template to file a complaint for "Deficiency of Service" before the District Consumer Disputes Redressal Commission.',
      provisions: [
        { title: 'Jurisdiction Limits', desc: 'District Commissions handle claims up to ₹50 Lakhs under the Consumer Protection Act 2019.' },
        { title: 'Affidavit Format', desc: 'Requires a signed verification affidavit and chronological index of documents.' }
      ],
      docs: ['Complaint Draft Form', 'Affidavit Template', 'Fee Calculator'],
      pdfUrl: '/consumer-complaint-draft.pdf'
    },
    'Witness Statement Form': {
      title: 'Witness Statement Form',
      icon: <UserPlus className="w-5 h-5" />,
      fullDesc: 'Standard template to record ocular witness accounts at the accident spot to support claims and police investigations.',
      provisions: [
        { title: 'Statement Credibility', desc: 'Should record exact time, speed, weather conditions, and relative positions of vehicles.' },
        { title: 'Consent Clause', desc: 'Witness agrees to participate in subsequent arbitration or court hearings if necessary.' }
      ],
      docs: ['Witness Form Draft', 'ID Verification Guidelines'],
      pdfUrl: '/witness-statement-form.pdf'
    },
    'Witness Summons Form': {
      title: 'Witness Summons Form',
      icon: <Scale className="w-5 h-5" />,
      fullDesc: 'A formal legal template used to request the Tribunal/Court to summon a crucial witness to present oral or documentary evidence.',
      provisions: [
        { title: 'Summons Criteria', desc: 'Requires detailing why the witness\'s presence is necessary for justice.' },
        { title: 'Diet Money', desc: 'Allows filing travel and daily allowance compensation for the summoned witness.' }
      ],
      docs: ['Summons Application Form', 'Fee Receipt Sheet'],
      pdfUrl: '/witness-summons.pdf'
    },
    'Medical Reimbursement Draft': {
      title: 'Medical Reimbursement Draft',
      icon: <HeartPulse className="w-5 h-5" />,
      fullDesc: 'A template letter to claim reimbursement for medical expenditures incurred due to accident injuries under a health or motor policy.',
      provisions: [
        { title: 'Invoice Chronology', desc: 'Invoices must correspond precisely to discharge summaries and pharmacy prescriptions.' },
        { title: 'Compulsory Deductions', desc: 'Separates consumables from actual hospitalisation charges.' }
      ],
      docs: ['Reimbursement Request Letter', 'Expense Sheet Template'],
      pdfUrl: '/medical-reimbursement.pdf'
    },
    'Loss of Income Affidavit': {
      title: 'Loss of Income Affidavit',
      icon: <Briefcase className="w-5 h-5" />,
      fullDesc: 'A legal affidavit template to claim compensation for loss of earnings during the recovery period after an accident.',
      provisions: [
        { title: 'Earnings Proof', desc: 'Must be supported by salary slips, Form 16, or Income Tax Returns.' },
        { title: 'Medical Certificate link', desc: 'Requires medical advisory certificate recommending absolute bed rest.' }
      ],
      docs: ['Affidavit Draft', 'Salary Certificate Form'],
      pdfUrl: '/loss-of-income.pdf'
    },
    'Vehicle Inspection Request': {
      title: 'Vehicle Inspection Request',
      icon: <FileSearch className="w-5 h-5" />,
      fullDesc: 'A formal letter template to request the RTO or an independent surveyor to conduct a mechanical inspection of the vehicle.',
      provisions: [
        { title: 'Mechanical Defect Check', desc: 'Ensures that brake failure or steering defects are recorded immediately after the accident.' },
        { title: 'Evidence Preservation', desc: 'Acts as crucial evidence in MACT disputes regarding mechanical breakdown.' }
      ],
      docs: ['Inspection Request Form', 'Fee Payment Receipt'],
      pdfUrl: '/vehicle-inspection.pdf'
    },
    'Check Injuries': {
      title: 'Check Injuries',
      icon: <HeartPulse className="w-5 h-5" />,
      fullDesc: 'The primary safety protocol focusing on checking for physical trauma immediately after an accident has occurred.',
      provisions: [
        { title: 'Assess Severity', desc: 'Examine passengers and yourself for bleeding, shock, chest pain, or loss of mobility.' },
        { title: 'Spinal Safety Warning', desc: 'Never pull an injured passenger from a vehicle unless there is an active threat of fire or explosion.' }
      ],
      docs: ['First Aid Manual', 'Concussion Symptoms Guide']
    },
    'Secure Scene': {
      title: 'Secure Scene',
      icon: <AlertTriangle className="w-5 h-5" />,
      fullDesc: 'Critical steps to prevent secondary accidents by marking the collision zone and warning oncoming traffic.',
      provisions: [
        { title: 'Hazard Lights', desc: 'Turn on hazard indicators immediately. Place warning reflective triangles 50 meters behind the vehicle.' },
        { title: 'Safe Relocation', desc: 'If the vehicles are operational, move them to the hard shoulder to avoid highway pileups.' }
      ],
      docs: ['Highway Safety Manual', 'Reflector Setup Sheet']
    },
    'Exchange Info': {
      title: 'Exchange Info',
      icon: <UserPlus className="w-5 h-5" />,
      fullDesc: 'Information gathering protocol to exchange registration, licensing, and insurance data with the other driver.',
      provisions: [
        { title: 'Required Fields', desc: 'Collect Full Name, Phone Number, Vehicle Registration Number, and Insurer Company details.' },
        { title: 'De-escalate Tension', desc: 'Avoid exchanging arguments or admitting guilt. Focus solely on document collection.' }
      ],
      docs: ['Contact Card Template', 'Information Log Sheet']
    },
    'Visual Evidence': {
      title: 'Visual Evidence',
      icon: <FileSearch className="w-5 h-5" />,
      fullDesc: 'Preservation of physical evidence using high-resolution photos and videos of the accident spot.',
      provisions: [
        { title: 'Vehicle Damages', desc: 'Capture close-ups of specific impacts, license plates, and tyre tracks on the road.' },
        { title: 'Environmental Factors', desc: 'Document traffic signs, road quality, weather conditions, and relative positions.' }
      ],
      docs: ['Photo Capture Guide', 'Scene Preservation Checklist']
    },
    'Emergency Contact': {
      title: 'Emergency Contact',
      icon: <UserPlus className="w-5 h-5" />,
      fullDesc: 'Guidelines on alerting family, local road assistance, and your insurance provider about the collision.',
      provisions: [
        { title: 'Alert Family/Friends', desc: 'Send GPS location links and immediate medical status updates via SMS.' },
        { title: 'Call Insurer Toll-Free', desc: 'Report the accident immediately to initiate the claim tracking process.' }
      ],
      docs: ['Emergency Helplines Sheet', 'SOS Broadcast Setup']
    },
    'Road Hazard Check': {
      title: 'Road Hazard Check',
      icon: <AlertTriangle className="w-5 h-5" />,
      fullDesc: 'Inspection for secondary hazards on the spot, including fuel leaks, electrical sparks, and structural stability.',
      provisions: [
        { title: 'Fuel Leakage', desc: 'Check if petrol or diesel is dripping. Smoking or matches are strictly prohibited near the crash site.' },
        { title: 'Electrical Isolation', desc: 'Switch off the engine to isolate the battery and prevent electrical fires.' }
      ],
      docs: ['Vehicle Safety Guide', 'Fire Hazard Protocol']
    },
    'Police Report': {
      title: 'Police Report',
      icon: <Scale className="w-5 h-5" />,
      fullDesc: 'Statutory requirements for reporting the accident to law enforcement to obtain legal verification certificates.',
      provisions: [
        { title: 'Zero FIR Registration', desc: 'Register the FIR at the nearest police station regardless of territory limits.' },
        { title: 'GD Entry Option', desc: 'For minor accidents, get a General Diary (GD) entry copy for minor claim settlements.' }
      ],
      docs: ['FIR Request Letter Format', 'GD Entry Application Form']
    },
    'Mental Health': {
      title: 'Mental Health',
      icon: <HeartPulse className="w-5 h-5" />,
      fullDesc: 'Checking for post-traumatic stress disorder, shock, or severe anxiety symptoms following the accident.',
      provisions: [
        { title: 'Identify Shock', desc: 'Look for cold sweat, rapid breathing, confusion, or emotional numbness.' },
        { title: 'Seek Consultation', desc: 'Consult qualified psychologists or counselors to process the trauma early.' }
      ],
      docs: ['PTSD Recovery Booklet', 'Counseling Contact Directory']
    },
    'Advocate Rahul Sharma': {
      title: 'Advocate Rahul Sharma',
      icon: <User className="w-5 h-5" />,
      fullDesc: 'Professional review from Advocate Rahul Sharma verifying the technical correctness of the knowledge base legal guides.',
      provisions: [
        { title: 'Credentials', desc: 'High Court Advocate with 15+ years experience in Motor Accident Claims and Consumer Disputes.' },
        { title: 'Expert Analysis', desc: 'Matches the exact IRDAI timelines and Motor Vehicles Act statutory codes. Highly recommended.' }
      ],
      docs: ['Bar Council Verification Registry', 'Verified Advocate Badge']
    },
    'Priya Verma': {
      title: 'Priya Verma',
      icon: <User className="w-5 h-5" />,
      fullDesc: 'Platform review from policyholder Priya Verma detailing successful claim resolution using appeal templates.',
      provisions: [
        { title: 'User Experience', desc: 'Applied the legal notice template after her own-damage claim was wrongfully rejected.' },
        { title: 'Outcome', desc: 'Received full IDV payout within 15 days of notice delivery. Exceptional legal utility.' }
      ],
      docs: ['Verified User Ticket', 'Resolved Claim Reference']
    },
    'Dr. Amit Patel': {
      title: 'Dr. Amit Patel',
      icon: <User className="w-5 h-5" />,
      fullDesc: 'Medical advisory verification from Dr. Amit Patel on the emergency and Golden Hour safety checklists.',
      provisions: [
        { title: 'Designation', desc: 'Chief Trauma Surgeon at National Medical Institute.' },
        { title: 'Review Comments', desc: 'Excellent layout of safety protocols. Encourages the right actions during emergency triage.' }
      ],
      docs: ['Medical Registry Certificate', 'Trauma Safety Guidelines']
    },
    'Sanjay Mehra': {
      title: 'Sanjay Mehra',
      icon: <User className="w-5 h-5" />,
      fullDesc: 'Technical endorsement from licensed insurance surveyor Sanjay Mehra on claim calculations and total loss logics.',
      provisions: [
        { title: 'Background', desc: 'IRDAI Category-A Loss Assessor and Vehicle Valuer.' },
        { title: 'Valuation Audit', desc: 'The depreciation percentages and Constructive Total Loss calculations align with industry regulations.' }
      ],
      docs: ['IRDAI License Copy', 'Surveyor Endorsement Certificate']
    },
    'Anjali Gupta': {
      title: 'Anjali Gupta',
      icon: <User className="w-5 h-5" />,
      fullDesc: 'Consumer activist Anjali Gupta reviews the NCDRC complaint drafts and consumer rights procedures.',
      provisions: [
        { title: 'Affiliation', desc: 'General Secretary, Consumer Rights Forum (India).' },
        { title: 'Review Remarks', desc: 'Perfect tool to bypass lawyers and enable policyholders to represent themselves in Consumer Forums.' }
      ],
      docs: ['Forum Affiliation Proof', 'Verified NGO Stamp']
    },
    'Vikram Singh': {
      title: 'Vikram Singh',
      icon: <User className="w-5 h-5" />,
      fullDesc: 'User testimonial from Vikram Singh on using witness statements to secure court verdicts.',
      provisions: [
        { title: 'Incident', desc: 'Victim of a commercial truck collision in 2023.' },
        { title: 'Legal Result', desc: 'The witness template secured critical spot evidence that helped win the tribunal dispute.' }
      ],
      docs: ['Court Order Copy (Redacted)', 'Success Case Record']
    },
    'Rohan Joshi': {
      title: 'Rohan Joshi',
      icon: <User className="w-5 h-5" />,
      fullDesc: 'Endorsement from automobile valuer Rohan Joshi on vehicle repair and salvage valuation logic.',
      provisions: [
        { title: 'Role', desc: 'Chief Engineer, Salvage Valuation Bureau.' },
        { title: 'Feedback', desc: 'Simplifies complicated salvage calculations. Ideal for educating vehicle owners on market depreciation.' }
      ],
      docs: ['Valuer Accreditation ID', 'Salvage Market Standards Guide']
    },
    'Legal Tech Review': {
      title: 'Legal Tech Review',
      icon: <User className="w-5 h-5" />,
      fullDesc: 'Editorial review and safety verification from the independent journal Legal Tech Review.',
      provisions: [
        { title: 'Audit Scope', desc: 'Independent technical evaluation of safety, privacy, and legal document layouts.' },
        { title: 'Conclusion', desc: 'Awarded 5 Stars for excellence in legal accessibility, data encryption, and public safety advisory.' }
      ],
      docs: ['Legal Tech Audit Report', 'Tech Excellence Award 2025']
    },
    'What is a Zero Depreciation policy?': {
      title: 'What is a Zero Depreciation policy?',
      icon: <HelpCircle className="w-5 h-5" />,
      fullDesc: 'Zero Depreciation is an optional add-on cover that ensures you get the full claim amount for replaced parts without any deduction for depreciation.',
      provisions: [
        { title: 'Nil Depreciation Benefit', desc: 'Normal policies deduct 50% on plastic, 30% on fiber, and 10% to 50% on metal parts. Zero Dep covers all parts at 100%.' },
        { title: 'Applicability Limits', desc: 'Generally offered only for cars under 5 years old. Insurers typically restrict Zero Dep to 2 claims per policy year.' }
      ],
      docs: ['Policy Add-on Schedule', 'Depreciation Rates Chart']
    },
    'How long do I have to report an accident?': {
      title: 'How long do I have to report an accident?',
      icon: <HelpCircle className="w-5 h-5" />,
      fullDesc: 'Guidelines and statutory timelines for notifying the police and insurance companies after a motor accident.',
      provisions: [
        { title: 'Insurance Notice', desc: 'Must report to the insurer within 24 to 72 hours of the incident. Delay might lead to rejection.' },
        { title: 'Police Notification', desc: 'Accidents involving injury or death must be reported to the police immediately (under 24 hours).' }
      ],
      docs: ['Intimation Form Template', 'Late Submission Waiver Format']
    },
    'Can I claim if the other driver was at fault?': {
      title: 'Can I claim if the other driver was at fault?',
      icon: <HelpCircle className="w-5 h-5" />,
      fullDesc: 'Explains the process of filing a Third-Party Claim against the insurance company of the driver who caused the collision.',
      provisions: [
        { title: 'Filing Procedure', desc: 'Obtain the FIR copy, locate the other vehicle\'s insurer via RTO records, and file a claim petition in the MACT.' },
        { title: 'No Fault Interim', desc: 'You can claim compensation without proving negligence under Section 164 of the Motor Vehicles Act.' }
      ],
      docs: ['Other Driver RTO Search Form', 'MACT Claim Petition Draft']
    },
    'What if the insurer rejects my claim?': {
      title: 'What if the insurer rejects my claim?',
      icon: <HelpCircle className="w-5 h-5" />,
      fullDesc: 'Resolution avenues and legal steps to take if your motor insurance claim is denied or partially settled by the insurer.',
      provisions: [
        { title: 'Internal GRO Escalation', desc: 'File a formal appeal to the Grievance Redressal Officer. Insurers must reply with a decision in 15 days.' },
        { title: 'Ombudsman Complaint', desc: 'For claims under ₹30 Lakhs, submit a complaint to the Insurance Ombudsman within 1 year of GRO rejection.' }
      ],
      docs: ['GRO Appeal Letter Format', 'Ombudsman Form Annexure VI']
    },
    'What is IDV in insurance?': {
      title: 'What is IDV in insurance?',
      icon: <HelpCircle className="w-5 h-5" />,
      fullDesc: 'Insured Declared Value (IDV) is the maximum sum assured fixed by the insurer, representing the current market value of your vehicle.',
      provisions: [
        { title: 'Calculation Method', desc: 'IDV = Manufacturer\'s listed price minus age-based depreciation (e.g. 5% for <6 months, 50% for 4-5 years).' },
        { title: 'Total Loss Limit', desc: 'If repair costs exceed 75% of IDV, the claim is settled by paying the full IDV to the owner.' }
      ],
      docs: ['IDV Depreciation Schedule Table', 'Current Valuation Report']
    },
    'Can I choose my own garage?': {
      title: 'Can I choose my own garage?',
      icon: <HelpCircle className="w-5 h-5" />,
      fullDesc: 'Explains the difference between cashless repairs at network garages and reimbursement repairs at non-network workshops.',
      provisions: [
        { title: 'Cashless Option', desc: 'Only available at garages pre-approved and networked by your insurer. Payment goes directly from insurer to garage.' },
        { title: 'Reimbursement Option', desc: 'You can repair the vehicle at any workshop, pay the bill yourself, and later submit invoices to the insurer for refund.' }
      ],
      docs: ['Network Garage Directory List', 'Reimbursement Claim Checklist']
    },
    'How to file a Zero FIR?': {
      title: 'How to file a Zero FIR?',
      icon: <HelpCircle className="w-5 h-5" />,
      fullDesc: 'A legal safety right that allows victims to file an First Information Report (FIR) at any police station, irrespective of where the crime occurred.',
      provisions: [
        { title: 'Territorial Freedom', desc: 'Police cannot refuse to register an FIR claiming the accident did not happen in their local area.' },
        { title: 'Transfer Protocol', desc: 'The station registers the case under number "00" and immediately transfers it to the competent station.' }
      ],
      docs: ['Zero FIR Application format', 'Supreme Court Guidelines copy']
    },
    'What is the "Golden Hour"?': {
      title: 'What is the "Golden Hour"?',
      icon: <HelpCircle className="w-5 h-5" />,
      fullDesc: 'The first hour after a traumatic injury when prompt medical treatment is most likely to prevent death or permanent disability.',
      provisions: [
        { title: 'Statutory Medical Right', desc: 'Section 162 of the MV Act mandates free emergency stabilization at all hospitals during the Golden Hour.' },
        { title: 'Good Samaritan Safeguards', desc: 'Protects helpers who transport the victim to a hospital from legal and administrative hassles.' }
      ],
      docs: ['Golden Hour Medical Protocol', 'Good Samaritan Guidelines']
    }
  };

  const sections = [
    { id: 'rights', label: 'Rights', icon: <Scale className="w-4 h-4" /> },
    { id: 'claims', label: 'Claims', icon: <FileSignature className="w-4 h-4" /> },
    { id: 'documents', label: 'Legal Docs', icon: <Landmark className="w-4 h-4" /> },
    { id: 'templates', label: 'Templates', icon: <FileText className="w-4 h-4" /> },
    { id: 'checklist', label: 'Safety', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'faq', label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const rightsData = [
    { title: 'MACT Jurisdiction', desc: 'Judicial oversight for incident compensation.', icon: <Gavel className="w-5 h-5" /> },
    { title: 'Insurer Compliance', desc: 'Regulatory protocols for claim settlement.', icon: <ShieldAlert className="w-5 h-5" /> },
    { title: 'Consumer Protection', desc: 'Rights regarding part replacement and depreciation.', icon: <Lightbulb className="w-5 h-5" /> },
    { title: 'Road Safety Statutes', desc: 'Solatium Fund and Good Samaritan protocols.', icon: <ShieldCheck className="w-5 h-5" /> },
    { title: 'Lok Adalat Settlements', desc: 'Fast-track mediation for accident claims.', icon: <Scale className="w-5 h-5" /> },
    { title: 'Legal Aid Provisions', desc: 'Free legal assistance for underprivileged victims.', icon: <Landmark className="w-5 h-5" /> },
    { title: 'Ombudsman Rights', desc: 'Regulatory oversight for claim disputes.', icon: <ShieldIcon className="w-5 h-5" /> },
    { title: 'Police Accountability', desc: 'Rights regarding FIR registration and duty.', icon: <Scale className="w-5 h-5" /> },
  ];

  const claimsData = [
    { title: 'Third-Party Claim', desc: 'Claiming damages caused by another vehicle.', steps: ['FIR', 'MACT', 'Survey'], icon: <Scale className="w-5 h-5" /> },
    { title: 'Own Damage Claim', desc: 'Procedure for damage to your own vehicle.', steps: ['Notice', 'Survey', 'Garage'], icon: <ShieldCheck className="w-5 h-5" /> },
    { title: 'Theft Recovery', desc: 'Legal protocol for vehicle theft settlement.', steps: ['FIR', 'Untraceable', 'Settlement'], icon: <GanttChart className="w-5 h-5" /> },
    { title: 'Total Loss Logic', desc: 'Calculation of Constructive Total Loss.', steps: ['75% Rule', 'Salvage', 'IDV'], icon: <Landmark className="w-5 h-5" /> },
    { title: 'NCB Retention', desc: 'How to keep your No Claim Bonus.', steps: ['NCB Reserving', 'Policy Transfer', 'Grace Period'], icon: <Activity className="w-5 h-5" /> },
    { title: 'Cashless Settlement', desc: 'Direct payment to network garages.', steps: ['Pre-auth', 'Inspection', 'Final Payout'], icon: <Landmark className="w-5 h-5" /> },
    { title: 'Re-registration', desc: 'Process after chassis/engine replacement.', steps: ['Approval', 'NOC', 'RC Update'], icon: <GanttChart className="w-5 h-5" /> },
    { title: 'Claim Re-opening', desc: 'Revisiting closed claims due to fresh evidence.', steps: ['Appeal', 'Fresh Survey', 'Legal Notice'], icon: <FileSignature className="w-5 h-5" /> },
  ];

  const documentsData = [
    { name: 'Motor Vehicles Act 1988', category: 'Central Statute', size: '4.2 MB', url: '/mv-act-1988.pdf', icon: <Landmark className="w-5 h-5" /> },
    { name: 'Regulatory Protection', category: 'Regulatory Code', size: '2.8 MB', url: '/irdai-protection.pdf', icon: <ShieldAlert className="w-5 h-5" /> },
    { name: 'Road Safety Gazette 2024', category: 'Official Gazette', size: '1.5 MB', url: '/road-safety-gazette.pdf', icon: <Gavel className="w-5 h-5" /> },
    { name: 'MACT Procedure Rules', category: 'Judicial Manual', size: '3.1 MB', url: '/mact-rules.pdf', icon: <FileSignature className="w-5 h-5" /> },
    { name: 'National Road Safety Policy', category: 'Policy Document', size: '0.9 MB', url: '/road-safety-policy.pdf', icon: <ShieldIcon className="w-5 h-5" /> },
    { name: 'Motor Vehicle Rules 1989', category: 'Enforcement Rules', size: '5.4 MB', url: '/mv-rules-1989.pdf', icon: <Scale className="w-5 h-5" /> },
    { name: 'Solatium Fund Scheme', category: 'Statutory Scheme', size: '0.6 MB', url: '/solatium-scheme.pdf', icon: <Activity className="w-5 h-5" /> },
    { name: 'Standard Insurance Policy', category: 'Policy Template', size: '1.2 MB', url: '/standard-policy.pdf', icon: <FileText className="w-5 h-5" /> },
  ];

  const templatesData = [
    { name: 'Claim Rejection Appeal', type: 'Formal Letter', size: '1 MB', url: '/claim-appeal-letter.pdf', icon: <FileText className="w-5 h-5" /> },
    { name: 'Legal Notice to Insurer', type: 'Lawyer Verified', size: '2 MB', url: '/legal-notice-insurer.pdf', icon: <Gavel className="w-5 h-5" /> },
    { name: 'Consumer Complaint Draft', type: 'NCDRC Format', size: '1 MB', url: '/consumer-complaint-draft.pdf', icon: <FileSignature className="w-5 h-5" /> },
    { name: 'Witness Statement Form', type: 'Evidence Template', size: '0.5 MB', url: '/witness-statement-form.pdf', icon: <UserPlus className="w-5 h-5" /> },
    { name: 'Witness Summons Form', type: 'Court Template', size: '0.4 MB', url: '/witness-summons.pdf', icon: <Scale className="w-5 h-5" /> },
    { name: 'Medical Reimbursement Draft', type: 'Financial Draft', size: '0.7 MB', url: '/medical-reimbursement.pdf', icon: <HeartPulse className="w-5 h-5" /> },
    { name: 'Loss of Income Affidavit', type: 'Legal Affidavit', size: '1.1 MB', url: '/loss-of-income.pdf', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Vehicle Inspection Request', type: 'Formal Request', size: '0.3 MB', url: '/vehicle-inspection.pdf', icon: <FileSearch className="w-5 h-5" /> },
  ];

  const faqData = [
    { q: 'What is a Zero Depreciation policy?', a: 'Covers full cost of repairs without deducting depreciation.', icon: <HelpCircle className="w-5 h-5" /> },
    { q: 'How long do I have to report an accident?', a: 'Ideally within 24-48 hours. Max 3 days.', icon: <HelpCircle className="w-5 h-5" /> },
    { q: 'Can I claim if the other driver was at fault?', a: 'Yes, via a Third-Party Claim against their insurer.', icon: <HelpCircle className="w-5 h-5" /> },
    { q: 'What if the insurer rejects my claim?', a: 'Appeal using our templates or raise a formal dispute.', icon: <HelpCircle className="w-5 h-5" /> },
    { q: 'What is IDV in insurance?', a: 'IDV is the Insured Declared Value, the max sum the insurer will pay.', icon: <HelpCircle className="w-5 h-5" /> },
    { q: 'Can I choose my own garage?', a: 'Yes, but cashless only works in network garages.', icon: <HelpCircle className="w-5 h-5" /> },
    { q: 'How to file a Zero FIR?', a: 'You can file it at any police station regardless of jurisdiction.', icon: <HelpCircle className="w-5 h-5" /> },
    { q: 'What is the "Golden Hour"?', a: 'The first hour after an accident where medical aid is most critical.', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const checklistData = [
    { step: '01', title: 'Check Injuries', desc: 'Call 112 immediately if medical emergency.', icon: <HeartPulse className="w-5 h-5" /> },
    { step: '02', title: 'Secure Scene', desc: 'Use reflectors to warn other drivers.', icon: <AlertTriangle className="w-5 h-5" /> },
    { step: '03', title: 'Exchange Info', desc: 'Get names, phones, and policy details.', icon: <UserPlus className="w-5 h-5" /> },
    { step: '04', title: 'Visual Evidence', desc: 'Take photos of damage and plates.', icon: <FileSearch className="w-5 h-5" /> },
    { step: '05', title: 'Emergency Contact', desc: 'Alert family and your insurance agent.', icon: <UserPlus className="w-5 h-5" /> },
    { step: '06', title: 'Road Hazard Check', desc: 'Check for oil leaks or fire risks.', icon: <AlertTriangle className="w-5 h-5" /> },
    { step: '07', title: 'Police Report', desc: 'Obtain FIR or GD entry at the nearest station.', icon: <Scale className="w-5 h-5" /> },
    { step: '08', title: 'Mental Health', desc: 'Check for shock symptoms and seek aid.', icon: <HeartPulse className="w-5 h-5" /> },
  ];

  const reviewsData = [
    { user: 'Advocate Rahul Sharma', role: 'High Court Practitioner', content: 'The MACT Jurisdiction guide is exceptionally accurate. A must-have for any junior litigator.', rating: 5 },
    { user: 'Priya Verma', role: 'Policyholder', content: 'The Legal Notice template helped me settle my claim in 15 days after months of rejection. Life-saver!', rating: 5 },
    { user: 'Dr. Amit Patel', role: 'Medical Trauma Expert', content: 'Integrating the Golden Hour protocol into the safety checklist is a brilliant institutional move.', rating: 4 },
    { user: 'Sanjay Mehra', role: 'Insurance Surveyor', content: 'Comprehensive and regulatory-compliant. This hub simplifies the IRDAI compliance complexities.', rating: 5 },
    { user: 'Anjali Gupta', role: 'Consumer Rights Activist', content: 'The NCDRC complaint draft is perfectly formatted. Excellent resource for consumer empowerment.', rating: 5 },
    { user: 'Vikram Singh', role: 'Accident Survivor', content: 'The witness form helped me gather evidence at the spot. I won my case because of this tool.', rating: 5 },
    { user: 'Rohan Joshi', role: 'Automobile Engineer', content: 'The Total Loss logic is explained in simple terms. Very helpful for understanding salvage values.', rating: 4 },
    { user: 'Legal Tech Review', role: 'Independent Journal', content: 'AccidentAlerts Knowledge Hub is the gold standard for public legal awareness in the insurance sector.', rating: 5 },
  ];

  const searchResults = {
    rights: rightsData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase())),
    claims: claimsData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase())),
    documents: documentsData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase())),
    templates: templatesData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase())),
    faq: faqData.filter(item => item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.a.toLowerCase().includes(searchQuery.toLowerCase())),
    checklist: checklistData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase())),
    reviews: reviewsData.filter(item => item.user.toLowerCase().includes(searchQuery.toLowerCase()) || item.content.toLowerCase().includes(searchQuery.toLowerCase()))
  };

  const hasResults = searchQuery === '' || (
    searchResults.rights.length > 0 || 
    searchResults.claims.length > 0 || 
    searchResults.documents.length > 0 || 
    searchResults.templates.length > 0 || 
    searchResults.faq.length > 0 || 
    searchResults.checklist.length > 0 ||
    searchResults.reviews.length > 0
  );

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-900">

      {/* Top Header */}
      <header className="h-auto md:h-16 bg-white border-b border-zinc-200 flex flex-col md:flex-row items-start md:items-center justify-between px-6 lg:px-8 py-4 md:py-0 shrink-0 z-10 sticky top-0 gap-4 md:gap-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
         Go Back</button>
          <div className="h-6 w-px bg-zinc-200"></div>
          <h2 className="text-lg font-semibold text-zinc-900">Knowledge Hub</h2>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-zinc-300 focus:bg-white transition-colors text-zinc-900"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-zinc-200 transition-colors">
              <X className="w-3 h-3 text-zinc-500" />
            </button>
          )}
        </div>
      </header>

      <div className="bg-white border-b border-zinc-200 overflow-x-auto no-scrollbar">
        <div className="flex px-6 lg:px-8 py-2 gap-2 min-w-max">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => { 
                setActiveTab(section.id); 
                setSearchQuery(''); 
                setSearchParams({ tab: section.id });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === section.id && !searchQuery
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-zinc-900">Information & Guidelines</h1>
            <p className="text-sm text-zinc-500 mt-1">Resources and guides for accident claims verification.</p>
          </div>

          {!hasResults ? (
            <div className="py-20 text-center card-standard border-dashed">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-1">No Matches Found</h3>
              <p className="text-sm text-zinc-500">Try adjusting your search query.</p>
            </div>
          ) : searchQuery ? (
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Global Results</h3>
                <button onClick={() => setSearchQuery('')} className="text-sm font-medium text-blue-600 hover:underline">Clear</button>
              </div>

              {Object.keys(searchResults).map((key) => (
                searchResults[key].length > 0 && (
                  <section key={key}>
                    <h4 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2 capitalize">
                      {sections.find(s => s.id === key)?.icon} {sections.find(s => s.id === key)?.label} ({searchResults[key].length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {key === 'rights' && searchResults.rights.map((card, i) => (
                        <div key={i} className="card-standard cursor-pointer hover:border-zinc-400" onClick={() => setSelectedGuide(guideData[card.title])}>
                          <h3 className="text-sm font-semibold text-zinc-900 mb-1">{card.title}</h3>
                          <p className="text-xs text-zinc-500 line-clamp-2">{card.desc}</p>
                        </div>
                      ))}
                      {key === 'claims' && searchResults.claims.map((claim, i) => (
                        <div key={i} className="card-standard cursor-pointer hover:border-zinc-400 group" onClick={() => setSelectedGuide(guideData[claim.title])}>
                          <h3 className="text-sm font-semibold text-zinc-900 mb-1">{claim.title}</h3>
                          <p className="text-xs text-zinc-500 line-clamp-2">{claim.desc}</p>
                        </div>
                      ))}
                      {key === 'documents' && searchResults.documents.map((doc, i) => (
                        <div key={i} className="card-standard cursor-pointer hover:border-zinc-400 group" onClick={() => setSelectedGuide(guideData[doc.name])}>
                          <h4 className="text-sm font-semibold text-zinc-900 mb-1">{doc.name}</h4>
                          <p className="text-xs text-zinc-500">{doc.category}</p>
                        </div>
                      ))}
                      {key === 'templates' && searchResults.templates.map((file, i) => (
                        <div key={i} className="card-standard cursor-pointer hover:border-zinc-400 group" onClick={() => setSelectedGuide(guideData[file.name])}>
                          <h4 className="text-sm font-semibold text-zinc-900 mb-1">{file.name}</h4>
                          <p className="text-xs text-zinc-500">{file.type}</p>
                        </div>
                      ))}
                      {key === 'reviews' && searchResults.reviews.map((rev, i) => (
                        <div key={i} className="card-standard cursor-pointer hover:border-zinc-400 group" onClick={() => setSelectedGuide(guideData[rev.user])}>
                          <h4 className="text-sm font-semibold text-zinc-900 mb-1">{rev.user}</h4>
                          <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{rev.content}</p>
                        </div>
                      ))}
                      {key === 'faq' && searchResults.faq.map((faq, i) => (
                        <div key={i} className="card-standard cursor-pointer hover:border-zinc-400 group" onClick={() => setSelectedGuide(guideData[faq.q])}>
                          <h4 className="text-sm font-semibold text-zinc-900 mb-1">{faq.q}</h4>
                          <p className="text-xs text-zinc-500 line-clamp-2">{faq.a}</p>
                        </div>
                      ))}
                      {key === 'checklist' && searchResults.checklist.map((item, i) => (
                        <div key={i} className="card-standard cursor-pointer hover:border-zinc-400 group" onClick={() => setSelectedGuide(guideData[item.title])}>
                          <h4 className="text-sm font-semibold text-zinc-900 mb-1">{item.title}</h4>
                          <p className="text-xs text-zinc-500 line-clamp-2">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'rights' && (
                <motion.div key="rights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {rightsData.map((card, i) => (
                    <div key={i} className="card-standard cursor-pointer hover:border-zinc-400 group" onClick={() => setSelectedGuide(guideData[card.title])}>
                      <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        {card.icon}
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-2">{card.title}</h3>
                      <p className="text-xs text-zinc-500 mb-4">{card.desc}</p>
                      <button className="flex items-center gap-1 text-zinc-900 font-medium text-xs group-hover:underline">
                        Review <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'claims' && (
                <motion.div key="claims" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {claimsData.map((claim, i) => (
                    <div key={i} className="card-standard cursor-pointer hover:border-zinc-400 group flex flex-col justify-between" onClick={() => setSelectedGuide(guideData[claim.title])}>
                      <div>
                        <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          {claim.icon}
                        </div>
                        <h3 className="text-sm font-semibold text-zinc-900 mb-2">{claim.title}</h3>
                        <p className="text-xs text-zinc-500 mb-4">{claim.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {claim.steps.map((step, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-medium border border-zinc-200">
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="flex items-center gap-1 text-zinc-900 font-medium text-xs group-hover:underline mt-2">
                        Review Guide <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {documentsData.map((doc, i) => (
                    <div 
                      key={i} 
                      className="card-standard cursor-pointer hover:border-zinc-400 group flex flex-col justify-between" 
                      onClick={() => setSelectedGuide(guideData[doc.name])}
                    >
                      <div>
                        <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          {doc.icon}
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-900 mb-1">{doc.name}</h4>
                        <p className="text-xs text-zinc-500 mb-6">{doc.category} &middot; {doc.size}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          doc.url && window.open(doc.url, '_blank');
                        }}
                        className={`btn-secondary w-full flex justify-center items-center gap-2 ${!doc.url && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'templates' && (
                <motion.div key="templates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {templatesData.map((file, i) => (
                    <div 
                      key={i} 
                      className="card-standard cursor-pointer hover:border-zinc-400 group flex flex-col justify-between" 
                      onClick={() => setSelectedGuide(guideData[file.name])}
                    >
                      <div>
                        <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          {file.icon}
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-900 mb-1">{file.name}</h4>
                        <p className="text-xs text-zinc-500 mb-6">{file.type} &middot; {file.size}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          file.url && window.open(file.url, '_blank');
                        }}
                        className={`btn-secondary w-full flex justify-center items-center gap-2 ${!file.url && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'checklist' && (
                <motion.div key="checklist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {checklistData.map((item, i) => (
                    <div 
                      key={i} 
                      className="card-standard cursor-pointer hover:border-zinc-400 group relative overflow-hidden flex flex-col justify-between" 
                      onClick={() => setSelectedGuide(guideData[item.title])}
                    >
                      <div>
                        <div className="absolute top-4 right-4 text-2xl font-bold text-zinc-100 group-hover:text-zinc-200/60 transition-colors">
                          {item.step}
                        </div>
                        <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-lg flex items-center justify-center mb-4 relative z-10 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-900 mb-1 relative z-10">{item.title}</h4>
                        <p className="text-xs text-zinc-500 relative z-10">{item.desc}</p>
                      </div>
                      <button className="flex items-center gap-1 text-zinc-900 font-medium text-xs group-hover:underline mt-4 relative z-10">
                        Review Step <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {reviewsData.map((rev, i) => (
                    <div 
                      key={i} 
                      className="card-standard cursor-pointer hover:border-zinc-400 group flex flex-col justify-between" 
                      onClick={() => setSelectedGuide(guideData[rev.user])}
                    >
                      <div>
                        <div className="flex gap-1 mb-3">
                          {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                        </div>
                        <p className="text-sm text-zinc-600 mb-6 italic">"{rev.content}"</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-zinc-900">{rev.user}</h4>
                            <p className="text-xs text-zinc-500">{rev.role}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'faq' && (
                <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {faqData.map((faq, i) => (
                    <div 
                      key={i} 
                      className="card-standard cursor-pointer hover:border-zinc-400 group flex flex-col justify-between" 
                      onClick={() => setSelectedGuide(guideData[faq.q])}
                    >
                      <div>
                        <div className="w-8 h-8 bg-zinc-100 text-zinc-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          {faq.icon}
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-900 mb-2">{faq.q}</h4>
                        <p className="text-xs text-zinc-500 mb-4">{faq.a}</p>
                      </div>
                      <button className="flex items-center gap-1 text-zinc-900 font-medium text-xs group-hover:underline mt-2">
                        Detailed Guide <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* GUIDE MODAL */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 text-zinc-900 rounded-lg flex items-center justify-center">
                    {selectedGuide.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900">{selectedGuide.title}</h2>
                    <p className="text-xs font-medium text-zinc-500">Statutory Guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-none">
                  <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 text-sm">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p>{selectedGuide.fullDesc}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <section>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Key Provisions</h3>
                      <ul className="space-y-4">
                        {selectedGuide.provisions.map((p, i) => (
                          <li key={i} className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-zinc-900 mb-1">{p.title}</p>
                              <p className="text-sm text-zinc-500 leading-relaxed">{p.desc}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Documentation Required</h3>
                      <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 mb-6">
                        <ul className="space-y-3">
                          {selectedGuide.docs.map((doc, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-zinc-700">
                              <CheckSquare className="w-4 h-4 text-zinc-400" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => selectedGuide.pdfUrl && window.open(selectedGuide.pdfUrl, '_blank')}
                        disabled={!selectedGuide.pdfUrl}
                        className={`w-full p-4 border border-zinc-200 rounded-lg flex items-center justify-between group hover:border-zinc-400 transition-colors bg-white ${!selectedGuide.pdfUrl && 'opacity-50 cursor-not-allowed hover:border-zinc-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                            <Download className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900" />
                          </div>
                          <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                            {selectedGuide.pdfUrl ? 'Download Official PDF' : 'PDF Pending'}
                          </span>
                        </div>
                      </button>
                    </section>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-end">
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
