import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Resolve. Instantly.": "AccidentAlert",
      "Home": "Home",
      "How It Works": "How It Works",
      "Features": "Features",
      "For Insurers": "For Insurers",
      "Contact": "Contact",
      "Login": "Login",
      "Register": "Register",
      "Report Accident Now": "Report Accident Now",
      "Hero Headline": "Accident? Report. Claim. Resolved — In Minutes.",
      "Hero Subheadline": "The fastest way to report accidents, file claims, and get settlements with complete transparency.",
      "Report an Accident": "Report an Accident",
      "File a Claim": "File a Claim",
      "Claims resolved today": "Claims resolved today",
      "Accidents reported": "Accidents reported",
    }
  },
  hi: {
    translation: {
      "Resolve. Instantly.": "AccidentAlert (एक्सीडेंट अलर्ट)",
      "Home": "होम",
      "How It Works": "यह कैसे काम करता है",
      "Features": "विशेषताएं",
      "For Insurers": "बीमाकर्ताओं के लिए",
      "Contact": "संपर्क",
      "Login": "लॉगिन",
      "Register": "रजिस्टर",
      "Report Accident Now": "अभी दुर्घटना रिपोर्ट करें",
      "Hero Headline": "दुर्घटना? रिपोर्ट। दावा। समाधान — मिनटों में।",
      "Hero Subheadline": "पूरी पारदर्शिता के साथ दुर्घटनाओं की रिपोर्ट करने, दावों को दाखिल करने और निपटान प्राप्त करने का सबसे तेज़ तरीका।",
      "Report an Accident": "दुर्घटना की रिपोर्ट करें",
      "File a Claim": "दावा दाखिल करें",
      "Claims resolved today": "आज हल किए गए दावे",
      "Accidents reported": "रिपोर्ट की गई दुर्घटनाएं",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
