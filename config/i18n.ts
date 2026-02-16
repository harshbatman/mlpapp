import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "Home": "Home",
            "Post": "Post",
            "Profile": "Profile",
            "About Us": "About Us",
            "Language": "Language",
            "Logout": "Logout",
            "Welcome": "Welcome",
            "Find Dream": "Find your dream",
            "Property": "Property",
            "Search": "Search",
            "Categories": "Categories",
            "Join MAHTO": "Join MAHTO",
            "Land to Lending": "Land to Lending",
            "Mission": "Our Mission",
            "Vision": "Our Vision",
            "Sabka Sar": "A roof over every head — not a roof, but own roof.",
            "Global OS": "To raise living standards by becoming the global operating system for home building.",
            "Marketplace": "Worker, Contractor & Shops Marketplace",
            "Mine": "Full-stack Construction & Renovation Services",
            "Home Loans": "Home Loans Marketplace",
            "Land Properties": "Land & Property Listings",
            "Select Location": "Select Location",
            "Current Location": "Current Location",
            "Detect My Location": "Detect My Location",
            "Search properties, lands...": "Search properties, lands...",
            "EXCLUSIVE REWARDS": "EXCLUSIVE REWARDS",
            "Refer & Earn ₹5000": "Refer & Earn ₹5000",
            "Refer Reward Desc": "Refer a property and get instant cash rewards upon successful listing.",
            "Explore Cities": "Explore Cities",
            "Featured Listings": "Featured Listings",
            "No listings yet.": "No listings yet.",
            "Be the first one to post!": "Be the first one to post a property!",
            "Post Now": "Post Now",
            "All India": "All India",
            "See All": "See All",
            "LIMITED OFFER": "LIMITED OFFER",
            "Post Free Title": "Post Now - It's Free! 🎊",
            "Post Free Desc": "List your property today and reach thousands of buyers instantly.",
            "Building Future": "BUILDING THE FUTURE",
            "Home Building OS": "Home Building OS",
            "MAHTO Manifesto": "MAHTO is the operating system for home building. We are building one unified system that brings together everything required to build a home.",
            "Fragmented Reality": "Today, building a home means dealing with fragmented vendors, contractors, workers, and middlemen.",
            "MAHTO Solution": "MAHTO simplifies this entire journey into a single, integrated platform — end to end.",
            "What Building": "WHAT WE'RE BUILDING",
            "MAHTO Ecosystem": "MAHTO Ecosystem",
            "Full Stack Quote": "\"Full-stack\" at MAHTO means from land to lending — not just design to construction.",
            "Account Preferences": "Account & Preferences",
            "Support Feedback": "Support & Feedback",
            "Helping Center": "Help Center / FAQ",
            "Contact Us": "Contact Us",
            "Notifications Inbox": "Notifications Inbox",
            "Notification Settings": "Notification Settings",
            "Edit Profile": "Edit Profile",
            "Saved": "Saved",
            "My Listings": "My Listings",
            "Views": "Views",
            "Rentals": "Rentals",
            "Logout Confirm Title": "Logout",
            "Logout Confirm Msg": "Are you sure you want to log out of your MAHTO account? You will need to sign in again to access your listings and saved properties.",
            "Stay Logged In": "Stay Logged In",
            "Logout Failed": "Logout Failed",
            "Delete Account": "Delete Account",
            "Delete Confirm Msg": "Please enter your details to confirm permanent deletion.",
            "Phone Number": "Phone Number",
            "Password": "Password",
            "Permanent Delete": "Permanent Delete",
            "Cancel": "Cancel",
            "Delete permanently": "Delete permanently",
            "Account Deleted": "Account Deleted",
            "Account Deleted Msg": "Your account has been permanently removed from the MAHTO ecosystem.",
            "Authentication Failed": "Authentication Failed",
            "Auth Failed Msg": "The phone number or password you entered is incorrect.",
            "Information Legal": "Information & Legal",
            "Terms Conditions": "Terms & Conditions",
            "Privacy Policy": "Privacy Policy",
            "Refund Policy": "Refund Policy",
            "Account Actions": "Account Actions",
            "Rate Us": "Rate Us",
            "Select Language": "Select Language",
            "Choose Language Pref": "Choose your preferred language for the MAHTO ecosystem."
        }
    },
    hi: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट करें",
            "Profile": "प्रोफ़ाइल",
            "About Us": "हमारे बारे में",
            "Language": "भाषा",
            "Logout": "लॉगआउट",
            "Welcome": "स्वागत है",
            "Find Dream": "अपना सपनों का घर ढूंढें",
            "Property": "संपत्ति",
            "Search": "खोजें",
            "Categories": "श्रेणियाँ",
            "Join MAHTO": "MAHTO से जुड़ें",
            "Land to Lending": "ज़मीन से लोन तक",
            "Mission": "हमारा मिशन",
            "Vision": "हमारा विजन",
            "Sabka Sar": "सबका सर अपनी छत।",
            "Global OS": "घर बनाने के लिए वैश्विक ऑपरेटिंग सिस्टम बनकर जीवन स्तर को ऊपर उठाना।",
            "Marketplace": "श्रमिक, ठेकेदार और दुकान बाज़ार",
            "Mine": "फुल-स्टैक निर्माण और नवीनीकरण सेवाएँ",
            "Home Loans": "होम लोन बाज़ार",
            "Land Properties": "भूमि और संपत्ति लिस्टिंग",
            "Select Location": "स्थान चुनें",
            "Current Location": "वर्तमान स्थान",
            "Detect My Location": "मेरा स्थान पता करें",
            "Search properties, lands...": "संपत्ति, भूमि खोजें...",
            "EXCLUSIVE REWARDS": "विशेष पुरस्कार",
            "Refer & Earn ₹5000": "रेफ़र करें और ₹5000 कमाएँ",
            "Refer Reward Desc": "किसी संपत्ति का रेफ़र करें और सफल लिस्टिंग पर तुरंत नकद पुरस्कार प्राप्त करें।",
            "Explore Cities": "शहर देखें",
            "Featured Listings": "चुनिंदा लिस्टिंग",
            "No listings yet.": "अभी तक कोई लिस्टिंग नहीं है।",
            "Be the first one to post!": "अपने क्षेत्र में संपत्ति पोस्ट करने वाले पहले व्यक्ति बनें!",
            "Post Now": "अभी पोस्ट करें",
            "All India": "पूरा भारत",
            "See All": "सभी देखें",
            "LIMITED OFFER": "सीमित समय का ऑफर",
            "Post Free Title": "अभी पोस्ट करें - यह मुफ़्त है! 🎊",
            "Post Free Desc": "आज ही अपनी संपत्ति सूचीबद्ध करें और हज़ारों खरीदारों तक तुरंत पहुँचें।",
            "Building Future": "भविष्य का निर्माण",
            "Home Building OS": "होम बिल्डिंग OS",
            "MAHTO Manifesto": "MAHTO घर बनाने का ऑपरेटिंग सिस्टम है। हम एक एकीकृत प्रणाली बना रहे हैं जो घर बनाने के लिए आवश्यक सब कुछ एक साथ लाती है।",
            "Fragmented Reality": "आज, घर बनाने का मतलब अलग-अलग विक्रेताओं, ठेकेदारों, श्रमिकों और बिचौलियों से निपटना है।",
            "MAHTO Solution": "MAHTO इस पूरी यात्रा को एक एकल, एकीकृत मंच में सरल बनाता है — शुरू से अंत तक।",
            "What Building": "हम क्या बना रहे हैं",
            "MAHTO Ecosystem": "MAHTO इकोसिस्टम",
            "Full Stack Quote": "MAHTO में \"फुल-स्टैक\" का अर्थ है ज़मीन से लोन तक — न कि केवल डिज़ाइन से निर्माण तक।",
            "Account Preferences": "खाता और प्राथमिकताएं",
            "Support Feedback": "सहायता और प्रतिक्रिया",
            "Helping Center": "सहायता केंद्र / FAQ",
            "Contact Us": "संपर्क करें",
            "Notifications Inbox": "सूचनाएं",
            "Notification Settings": "सूचना सेटिंग्स",
            "Edit Profile": "प्रोफ़ाइल संपादित करें",
            "Saved": "सहेजा गया",
            "My Listings": "मेरी लिस्टिंग",
            "Views": "दृष्टि",
            "Rentals": "किराया",
            "Logout Confirm Title": "लॉगआउट",
            "Logout Confirm Msg": "क्या आप वाकई अपने MAHTO खाते से लॉग आउट करना चाहते हैं? अपनी लिस्टिंग और सहेजी गई संपत्तियों तक पहुँचने के लिए आपको फिर से साइन इन करना होगा।",
            "Stay Logged In": "लॉग इन रहें",
            "Logout Failed": "लॉगआउट विफल",
            "Delete Account": "खाता हटाएं",
            "Delete Confirm Msg": "स्थायी रूप से हटाने की पुष्टि करने के लिए कृपया अपना विवरण दर्ज करें।",
            "Phone Number": "फ़ोन नंबर",
            "Password": "पासवर्ड",
            "Permanent Delete": "स्थायी रूप से हटाएं",
            "Cancel": "रद्द करें",
            "Delete permanently": "स्थायी रूप से हटाएं",
            "Account Deleted": "खाता हटा दिया गया",
            "Account Deleted Msg": "आपका खाता MAHTO इकोसिस्टम से स्थायी रूप से हटा दिया गया है।",
            "Authentication Failed": "प्रमाणीकरण विफल",
            "Auth Failed Msg": "आपके द्वारा दर्ज किया गया फ़ोन नंबर या पासवर्ड गलत है।",
            "Information Legal": "सूचना और कानूनी",
            "Terms Conditions": "नियम और शर्तें",
            "Privacy Policy": "गोपनीयता नीति",
            "Refund Policy": "वापसी नीति",
            "Account Actions": "खाता क्रियाएं",
            "Rate Us": "हमें रेट करें",
            "Select Language": "भाषा चुनें",
            "Choose Language Pref": "MAHTO इकोसिस्टम के लिए अपनी पसंद की भाषा चुनें।"
        }
    },
    pa: {
        translation: {
            "Home": "ਹੋਮ",
            "Post": "ਪੋਸਟ ਕਰੋ",
            "Profile": "ਪ੍ਰੋਫਾਈਲ",
            "About Us": "ਸਾਡੇ ਬਾਰੇ",
            "Language": "ਭਾਸ਼ਾ",
            "Logout": "ਲੌਗਆਉਟ",
            "Welcome": "ਜੀ ਆਇਆ ਨੂੰ",
            "Find Dream": "ਆਪਣਾ ਸੁਪਨਾ ਲੱਭੋ",
            "Property": "ਜਾਇਦਾਦ",
            "Search": "ਖੋਜ",
            "Categories": "ਸ਼੍ਰੇਣੀਆਂ",
            "Sabka Sar": "ਸਭ ਦਾ ਸਿਰ ਆਪਣੀ ਛੱਤ।",
            "Explore Cities": "ਸ਼ਹਿਰ ਦੇਖੋ",
            "Featured Listings": "ਖਾਸ ਸੂਚੀਆਂ",
            "Post Now": "ਹੁਣੇ ਪੋਸਟ ਕਰੋ",
            "Select Language": "ਭਾਸ਼ਾ ਚੁਣੋ"
        }
    },
    ur: {
        translation: {
            "Home": "ہوم",
            "Post": "پوسٹ کریں",
            "Profile": "پروفائل",
            "About Us": "ہمارے بارے میں",
            "Language": "زبان",
            "Logout": "لاگ آؤٹ",
            "Welcome": "خوش آمدید",
            "Find Dream": "اپنا خواب تلاش کریں",
            "Property": "جائیداد",
            "Search": "تلاش",
            "Categories": "اقسام",
            "Sabka Sar": "سب کا سر اپنی چھت۔",
            "Explore Cities": "شہر دیکھیں",
            "Featured Listings": "نمایاں فہرستیں",
            "Post Now": "ابھی پوسٹ کریں",
            "Select Language": "زبان منتخب کریں"
        }
    },
    bn: {
        translation: {
            "Home": "হোম",
            "Post": "পোস্ট করুন",
            "Profile": "প্রোফাইল",
            "About Us": "আমাদের সম্পর্কে",
            "Language": "ভাষা",
            "Logout": "লগআউট",
            "Sabka Sar": "সবার মাথার ওপর নিজের ছাদ।"
        }
    },
    mr: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट करा",
            "Profile": "प्रोफाइल",
            "About Us": "आमच्याबद्दल",
            "Language": "भाषा",
            "Logout": "लॉगआउट",
            "Sabka Sar": "सर्वांचे डोके स्वतःच्या छताखाली।"
        }
    },
    gu: {
        translation: {
            "Home": "હોમ",
            "Post": "પોસ્ટ કરો",
            "Profile": "પ્રોફાઇલ",
            "About Us": "અમારા વિશે",
            "Language": "ભાષા",
            "Logout": "લૉગઆઉટ"
        }
    },
    kn: {
        translation: {
            "Home": "ಮನೆ",
            "Post": "ಪೋಸ್ಟ್ ಮಾಡಿ",
            "Profile": "ಪ್ರೊಫೈಲ್",
            "About Us": "ನಮ್ಮ ಬಗ್ಗೆ",
            "Language": "ಭಾಷೆ",
            "Logout": "ಲಾಗ್ಔಟ್"
        }
    },
    te: {
        translation: {
            "Home": "హోమ్",
            "Post": "పోస్ట్ చేయండి",
            "Profile": "ప్రొఫైల్",
            "About Us": "మా గురించి",
            "Language": "భాష",
            "Logout": "లాగ్అవుట్"
        }
    },
    ml: {
        translation: {
            "Home": "ഹോം",
            "Post": "പോസ്റ്റ് ചെയ്യുക",
            "Profile": "പ്രൊഫൈൽ",
            "About Us": "ഞങ്ങളെക്കുറിച്ച്",
            "Language": "ഭാഷ",
            "Logout": "ലോഗൗട്ട്"
        }
    },
    or: {
        translation: {
            "Home": "ହୋମ୍",
            "Post": "ପୋଷ୍ଟ୍ କରନ୍ତୁ",
            "Profile": "ପ୍ରୋଫାଇଲ୍",
            "About Us": "ଆମ ବିଷୟରେ",
            "Language": "ଭାଷା",
            "Logout": "ଲଗ୍ ଆଉଟ୍"
        }
    },
    ne: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट गर्नुहोस्",
            "Profile": "प्रोफाइल",
            "About Us": "हाम्रो बारेमा",
            "Language": "भाषा",
            "Logout": "लॉगआउट"
        }
    },
    bho: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट करीं",
            "Profile": "प्रोफाइल",
            "About Us": "हमार बारे में",
            "Language": "भाषा",
            "Logout": "लॉगआउट",
            "Sabka Sar": "सबके सर आपन छत।"
        }
    },
    har: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट कर",
            "Profile": "प्रोफाइल",
            "About Us": "म्हारे बारे में",
            "Language": "बोली",
            "Logout": "लॉगआउट",
            "Sabka Sar": "सबका सर अपनी छत।"
        }
    },
    raj: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट करो",
            "Profile": "प्रोफाइल",
            "About Us": "म्हारे बारे में",
            "Language": "भाषा",
            "Logout": "लॉगआउट",
            "Sabka Sar": "सगळां रो सिर आपणी छत।"
        }
    },
    mai: {
        translation: {
            "Home": "होम",
            "Post": "पोस्ट करू",
            "Profile": "प्रोफाइल",
            "About Us": "हमर बारे में",
            "Language": "भाषा",
            "Logout": "लॉगआउट"
        }
    },
    ks: {
        translation: {
            "Home": "ہوم",
            "Post": "پوسٹ کٔریو",
            "Profile": "پروفائل",
            "About Us": "سانیِ متعلق",
            "Language": "زبان",
            "Logout": "لاگ آؤٹ"
        }
    }
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem('user-language');

    if (!savedLanguage) {
        savedLanguage = Localization.getLocales()[0].languageCode || 'en';
    }

    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: savedLanguage,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });
};

initI18n();

export default i18n;
